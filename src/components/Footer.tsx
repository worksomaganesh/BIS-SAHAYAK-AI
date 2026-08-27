import React from 'react';
import { NavigationTab } from '../types';

interface FooterProps {
  onNavigate?: (tab: NavigationTab) => void;
  onOpenJuryDrawer?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenJuryDrawer }) => {
  return (
    <footer className="mt-16 bg-white dark:bg-zinc-950 border-t border-zinc-300 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 font-sans">
      {/* Official Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
        <div>
          <h4 className="font-mono font-bold text-zinc-950 dark:text-zinc-100 mb-3 uppercase text-[11px] tracking-wider">
            [ Official BIS Portals ]
          </h4>
          <ul className="space-y-2 font-mono text-[11px]">
            <li>
              <a
                href="https://www.bis.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-950 dark:hover:text-white text-zinc-600 dark:text-zinc-400 block transition-colors"
              >
                Bureau of Indian Standards →
              </a>
            </li>
            <li>
              <a
                href="https://www.manakonline.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-950 dark:hover:text-white text-zinc-600 dark:text-zinc-400 block transition-colors"
              >
                Manakonline (e-BIS) →
              </a>
            </li>
            <li>
              <a
                href="https://www.crsbis.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-950 dark:hover:text-white text-zinc-600 dark:text-zinc-400 block transition-colors"
              >
                CRS Electronics Registration →
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono font-bold text-zinc-950 dark:text-zinc-100 mb-3 uppercase text-[11px] tracking-wider">
            [ Schemes & Marks ]
          </h4>
          <ul className="space-y-2 font-mono text-[11px]">
            <li>
              <a
                href="https://www.manakonline.in/MANAK/ApplicationSubmission_eBIS"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-950 dark:hover:text-white text-zinc-600 dark:text-zinc-400 block transition-colors"
              >
                ISI Mark (Scheme-I) →
              </a>
            </li>
            <li>
              <a
                href="https://www.bis.gov.in/hallmarking-overview/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-950 dark:hover:text-white text-zinc-600 dark:text-zinc-400 block transition-colors"
              >
                Gold Hallmarking (HUID) →
              </a>
            </li>
            <li>
              <a
                href="https://www.bis.gov.in/laboratory-overview/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-950 dark:hover:text-white text-zinc-600 dark:text-zinc-400 block transition-colors"
              >
                Laboratory Network (LRS) →
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono font-bold text-zinc-950 dark:text-zinc-100 mb-3 uppercase text-[11px] tracking-wider">
            [ Citizen & Industry ]
          </h4>
          <ul className="space-y-2 font-mono text-[11px]">
            <li>
              <a
                href="https://www.bis.gov.in/consumer-affairs/bis-care-app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-950 dark:hover:text-white text-zinc-600 dark:text-zinc-400 block transition-colors"
              >
                BIS Care Mobile App →
              </a>
            </li>
            <li>
              <a
                href="https://www.manakonline.in/MANAK/ProductManuals"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-950 dark:hover:text-white text-zinc-600 dark:text-zinc-400 block transition-colors"
              >
                Product Manuals & STI →
              </a>
            </li>
            <li>
              <a
                href="https://www.bis.gov.in/product-certification/products-under-compulsory-certification/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-950 dark:hover:text-white text-zinc-600 dark:text-zinc-400 block transition-colors"
              >
                Compulsory QCOs Registry →
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono font-bold text-zinc-950 dark:text-zinc-100 mb-3 uppercase text-[11px] tracking-wider">
            [ Engine Architecture ]
          </h4>
          <div className="space-y-1.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            <p><strong>ENGINE:</strong> Grounded BIS Assistant</p>
            <p><strong>GROUNDING:</strong> 100% Gazette QCO & IS Clauses</p>
            <p><strong>PROTOCOL:</strong> Deterministic Local Matching</p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {onOpenJuryDrawer && (
                <button
                  type="button"
                  id="btn-footer-jury-mode"
                  onClick={onOpenJuryDrawer}
                  className="px-2.5 py-1 rounded bg-zinc-950 dark:bg-zinc-800 hover:bg-zinc-800 text-amber-300 text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer border border-zinc-700"
                  title="Open Evaluation Diagnostics Panel (Ctrl+J)"
                >
                  [ JURY MODE (Ctrl+J) ]
                </button>
              )}
              {onNavigate && (
                <button
                  onClick={() => onNavigate('private-tools')}
                  className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer border border-zinc-300 dark:border-zinc-700"
                >
                  [ Developer Suite ]
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
          <p className="leading-relaxed font-sans text-xs max-w-4xl">
            <strong className="text-zinc-950 dark:text-white font-mono text-[11px]">[ STATUTORY NOTICE ]</strong> BIS Sahayak AI is an independent research prototype for navigating Indian Standards and certification procedures. It is not an official BIS portal and does not issue licenses, certifications, or legal compliance approvals. Verify all standards on <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="underline text-zinc-950 dark:text-white font-semibold">bis.gov.in</a> and <a href="https://www.manakonline.in" target="_blank" rel="noopener noreferrer" className="underline text-zinc-950 dark:text-white font-semibold">manakonline.in</a>.
          </p>
          <div className="shrink-0 font-mono text-[10px] text-zinc-500">
            BIS ACT 2016 COMPLIANT
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
