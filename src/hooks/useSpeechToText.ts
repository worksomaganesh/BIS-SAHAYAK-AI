import { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../types';

interface UseSpeechToTextOptions {
  language?: Language;
  onTranscriptChange?: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
}

interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

// Map app language to standard BCP 47 tags for Indian regional speech models
export const getSpeechLanguageCode = (lang: Language): string => {
  switch (lang) {
    case 'te':
      return 'te-IN'; // Telugu (India)
    case 'hi':
      return 'hi-IN'; // Hindi (India)
    case 'en':
    default:
      return 'en-IN'; // Indian English
  }
};

export const useSpeechToText = (options: UseSpeechToTextOptions = {}): UseSpeechToTextReturn => {
  const { language = 'en', onTranscriptChange, onFinalTranscript } = options;
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const currentLanguageRef = useRef<Language>(language);

  // Keep ref synced
  useEffect(() => {
    currentLanguageRef.current = language;
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.lang = getSpeechLanguageCode(language);
      } catch (err) {
        console.warn('Could not dynamically update recognition language:', err);
      }
    }
  }, [language, isListening]);

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      setIsListening(false);
      setInterimTranscript('');
    }
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setError('SPEECH_NOT_SUPPORTED');
      return;
    }

    // Stop existing instance if running
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false; // Capture continuous phrase until silence
      recognition.interimResults = true;
      recognition.lang = getSpeechLanguageCode(currentLanguageRef.current);
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalSegment = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            finalSegment += result[0].transcript;
          } else {
            currentInterim += result[0].transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
          if (onTranscriptChange) {
            onTranscriptChange(currentInterim);
          }
        }

        if (finalSegment) {
          const trimmed = finalSegment.trim();
          setTranscript((prev) => (prev ? `${prev} ${trimmed}` : trimmed));
          setInterimTranscript('');
          if (onTranscriptChange) {
            onTranscriptChange(trimmed);
          }
          if (onFinalTranscript) {
            onFinalTranscript(trimmed);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setError('PERMISSION_DENIED');
        } else if (event.error === 'no-speech') {
          // Silent timeout without user speech, normal
          setError(null);
        } else if (event.error === 'network') {
          setError('NETWORK_ERROR');
        } else {
          setError(event.error || 'UNKNOWN_ERROR');
        }
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to initialize speech recognition:', err);
      setError('FAILED_TO_START');
      setIsListening(false);
    }
  }, [onTranscriptChange, onFinalTranscript]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};
