import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface FeeEstimatorProps {
  onAskAboutBudget?: (prompt: string) => void;
}

export type EnterpriseScale = 'micro-women' | 'small-msme' | 'medium' | 'large';
export type SchemeType = 'scheme-1-isi' | 'scheme-2-crs' | 'fmcs' | 'hallmarking';
export type ProductTier = 'water' | 'cement' | 'steel' | 'electronics' | 'toys' | 'general';

export const FeeEstimator: React.FC<FeeEstimatorProps> = ({ onAskAboutBudget }) => {
  const { language } = useLanguage();

  const [enterpriseScale, setEnterpriseScale] = useState<EnterpriseScale>('small-msme');
  const [schemeType, setSchemeType] = useState<SchemeType>('scheme-1-isi');
  const [productTier, setProductTier] = useState<ProductTier>('water');
  const [auditDays, setAuditDays] = useState<number>(2);
  const [sampleCount, setSampleCount] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Dynamic fee calculation engine
  const calculation = useMemo(() => {
    let baseAppFee = 1000;
    if (schemeType === 'fmcs') {
      baseAppFee = 84000;
    } else if (schemeType === 'hallmarking') {
      baseAppFee = 2000;
    }

    let baseAuditPerDay = 7000;
    if (schemeType === 'scheme-2-crs') {
      baseAuditPerDay = 0;
    } else if (schemeType === 'fmcs') {
      baseAuditPerDay = 35000;
    } else if (schemeType === 'hallmarking') {
      baseAuditPerDay = 5000;
    }
    const totalAuditFee = baseAuditPerDay * auditDays;

    let baseTestingPerSample = 15000;
    if (productTier === 'water') baseTestingPerSample = 22000;
    else if (productTier === 'cement') baseTestingPerSample = 32000;
    else if (productTier === 'steel') baseTestingPerSample = 38000;
    else if (productTier === 'electronics') baseTestingPerSample = 45000;
    else if (productTier === 'toys') baseTestingPerSample = 18000;
    else if (productTier === 'general') baseTestingPerSample = 12000;

    if (schemeType === 'hallmarking') {
      baseTestingPerSample = 5000;
    }
    const totalTestingFee = baseTestingPerSample * sampleCount;

    let baseMarkingFee = 45000;
    if (schemeType === 'scheme-2-crs') {
      baseMarkingFee = 50000;
    } else if (schemeType === 'fmcs') {
      baseMarkingFee = 150000;
    } else if (schemeType === 'hallmarking') {
      baseMarkingFee = 15000;
    } else {
      if (productTier === 'water') baseMarkingFee = 65000;
      else if (productTier === 'cement') baseMarkingFee = 110000;
      else if (productTier === 'steel') baseMarkingFee = 140000;
      else if (productTier === 'toys') baseMarkingFee = 35000;
      else if (productTier === 'general') baseMarkingFee = 40000;
    }

    let concessionRate = 0;
    let concessionLabel = 'Standard Commercial Schedule (No Concession)';

    if (schemeType === 'scheme-1-isi' || schemeType === 'scheme-2-crs') {
      if (enterpriseScale === 'micro-women') {
        concessionRate = 0.50;
        concessionLabel = '50% Special Concession (Micro / Women / SC-ST Enterprise)';
      } else if (enterpriseScale === 'small-msme') {
        concessionRate = 0.20;
        concessionLabel = '20% MSME Concession (Small Enterprise)';
      }
    }

    const appFeeDiscount = baseAppFee * concessionRate;
    const auditFeeDiscount = totalAuditFee * concessionRate;
    const markingFeeDiscount = baseMarkingFee * concessionRate;
    const totalDiscount = appFeeDiscount + auditFeeDiscount + markingFeeDiscount;

    const netAppFee = baseAppFee - appFeeDiscount;
    const netAuditFee = totalAuditFee - auditFeeDiscount;
    const netMarkingFee = baseMarkingFee - markingFeeDiscount;
    const netTestingFee = totalTestingFee;

    const subtotal = netAppFee + netAuditFee + netMarkingFee + netTestingFee;
    const estimatedGst = (netAppFee + netAuditFee + netMarkingFee) * 0.18;
    const grandTotalFirstYear = Math.round(subtotal + estimatedGst);
    const estimatedAnnualRenewal = Math.round(netMarkingFee + (netMarkingFee * 0.18));

    return {
      baseAppFee,
      netAppFee,
      totalAuditFee,
      netAuditFee,
      totalTestingFee,
      netTestingFee,
      baseMarkingFee,
      netMarkingFee,
      concessionRate,
      concessionLabel,
      totalDiscount: Math.round(totalDiscount),
      subtotal: Math.round(subtotal),
      estimatedGst: Math.round(estimatedGst),
      grandTotalFirstYear,
      estimatedAnnualRenewal,
    };
  }, [enterpriseScale, schemeType, productTier, auditDays, sampleCount]);

  const handleCopyEstimate = () => {
    const summary = `--- BIS ESTIMATED CERTIFICATION BUDGET ---
Enterprise Scale: ${enterpriseScale.toUpperCase()}
Scheme: ${schemeType.toUpperCase()}
Product Tier: ${productTier.toUpperCase()}
------------------------------------------
1. Application Fee: ₹${calculation.netAppFee.toLocaleString('en-IN')}
2. Inspection / Audit Fee (${auditDays} days): ₹${calculation.netAuditFee.toLocaleString('en-IN')}
3. Lab Sample Testing (${sampleCount} samples): ₹${calculation.netTestingFee.toLocaleString('en-IN')}
4. Minimum Marking / Registration Fee: ₹${calculation.netMarkingFee.toLocaleString('en-IN')}
------------------------------------------
MSME Concession Savings: ₹${calculation.totalDiscount.toLocaleString('en-IN')} (${calculation.concessionRate * 100}%)
Estimated 18% GST on Govt fees: ₹${calculation.estimatedGst.toLocaleString('en-IN')}
TOTAL ESTIMATED 1ST YEAR BUDGET: ₹${calculation.grandTotalFirstYear.toLocaleString('en-IN')}
ESTIMATED ANNUAL RENEWAL: ₹${calculation.estimatedAnnualRenewal.toLocaleString('en-IN')}
------------------------------------------
*Note: Indicative estimate. Official fee schedules must be verified on manakonline.in.`;

    navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleAskAIAboutBudget = () => {
    if (!onAskAboutBudget) return;
    let prompt = `Provide an itemized breakdown of the official BIS fee structure for a ${enterpriseScale} scale unit applying under ${schemeType} for ${productTier} products. Explain how MSME concessions, minimum marking fee, and audit man-day rates work.`;
    if (language === 'te') {
      prompt = `${enterpriseScale} స్థాయి పరిశ్రమ కోసం ${schemeType} క్రింద ${productTier} ఉత్పత్తులకు BIS సర్టిఫికేషన్ రుసుము (ఫీజులు), MSME రాయితీలు మరియు ఆడిట్ చార్జీల వివరాలను వివరించండి.`;
    } else if (language === 'hi') {
      prompt = `${enterpriseScale} स्तर के उद्यम के लिए ${schemeType} के अंतर्गत ${productTier} उत्पाद हेतु बीआईएस प्रमाणन शुल्क, एमएसएमई छूट और ऑडिट शुल्क का विस्तृत विवरण बताएं।`;
    }
    onAskAboutBudget(prompt);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner (Text-First) */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-xs space-y-4 font-mono">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              [ OFFICIAL CONFORMITY FEE BASELINE ]
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-zinc-950 dark:text-white">
              Indicative Fee Estimator
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans max-w-2xl">
              Estimate application, factory audit, sample testing, and minimum marking fees for Indian Standards certification with official MSME concessions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyEstimate}
              className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-zinc-300 dark:border-zinc-700 shadow-2xs uppercase"
            >
              {isCopied ? '[ Copied! ]' : '[ Copy Budget ]'}
            </button>

            {onAskAboutBudget && (
              <button
                type="button"
                onClick={handleAskAIAboutBudget}
                className="px-4 py-2.5 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer uppercase tracking-wider"
              >
                [ Ask AI Fee Advisory → ]
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
        {/* Left Column: Parameter Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Enterprise Scale Selector */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-950 dark:text-white uppercase">
                [ 1. Enterprise Scale & MSME Status ]
              </label>
              <span className="text-[10px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700">
                Concessions up to 50%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setEnterpriseScale('micro-women')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  enterpriseScale === 'micro-women'
                    ? 'border-zinc-950 dark:border-white bg-zinc-100 dark:bg-zinc-800 font-bold'
                    : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-950 dark:text-white">
                    Micro / Women / SC-ST
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-[9px] font-bold">
                    [ 50% OFF ]
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 font-sans">
                  Udyam micro unit or women/SC-ST owned enterprise.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setEnterpriseScale('small-msme')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  enterpriseScale === 'small-msme'
                    ? 'border-zinc-950 dark:border-white bg-zinc-100 dark:bg-zinc-800 font-bold'
                    : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-950 dark:text-white">
                    Small Enterprise (MSME)
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 text-[9px] font-bold">
                    [ 20% OFF ]
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 font-sans">
                  Small manufacturing unit with registered Udyam certificate.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setEnterpriseScale('medium')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  enterpriseScale === 'medium'
                    ? 'border-zinc-950 dark:border-white bg-zinc-100 dark:bg-zinc-800 font-bold'
                    : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'
                }`}
              >
                <span className="text-xs font-bold text-zinc-950 dark:text-white">
                  Medium Enterprise
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 font-sans">
                  Standard commercial fee schedule applies.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setEnterpriseScale('large')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  enterpriseScale === 'large'
                    ? 'border-zinc-950 dark:border-white bg-zinc-100 dark:bg-zinc-800 font-bold'
                    : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'
                }`}
              >
                <span className="text-xs font-bold text-zinc-950 dark:text-white">
                  Large / Multinational
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 font-sans">
                  Standard baseline for large industrial scale operations.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Certification Scheme Selector */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-2xs space-y-3">
            <label className="text-xs font-bold text-zinc-950 dark:text-white uppercase">
              [ 2. Certification Scheme ]
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSchemeType('scheme-1-isi')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  schemeType === 'scheme-1-isi'
                    ? 'border-zinc-950 dark:border-white bg-zinc-100 dark:bg-zinc-800 font-bold'
                    : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'
                }`}
              >
                <span className="text-xs text-zinc-950 dark:text-white block">
                  Scheme-I (ISI Mark)
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 font-sans">
                  Factory audit + sample testing + CM/L license grant.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSchemeType('scheme-2-crs')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  schemeType === 'scheme-2-crs'
                    ? 'border-zinc-950 dark:border-white bg-zinc-100 dark:bg-zinc-800 font-bold'
                    : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'
                }`}
              >
                <span className="text-xs text-zinc-950 dark:text-white block">
                  Scheme-II / CRS (Electronics)
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 font-sans">
                  Self-declaration based on recognized lab test report.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSchemeType('fmcs')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  schemeType === 'fmcs'
                    ? 'border-zinc-950 dark:border-white bg-zinc-100 dark:bg-zinc-800 font-bold'
                    : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'
                }`}
              >
                <span className="text-xs text-zinc-950 dark:text-white block">
                  FMCS (Foreign Manufacturers)
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 font-sans">
                  International inspection + USD fee schedule.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSchemeType('hallmarking')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  schemeType === 'hallmarking'
                    ? 'border-zinc-950 dark:border-white bg-zinc-100 dark:bg-zinc-800 font-bold'
                    : 'border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'
                }`}
              >
                <span className="text-xs text-zinc-950 dark:text-white block">
                  Hallmarking (A&H Centres)
                </span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 font-sans">
                  Assaying centre recognition and jeweler registration.
                </p>
              </button>
            </div>
          </div>

          {/* 3. Product Complexity */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-2xs space-y-4">
            <label className="text-xs font-bold text-zinc-950 dark:text-white uppercase">
              [ 3. Product Complexity & Inspection Scope ]
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Product Category / Sector:
                </label>
                <select
                  value={productTier}
                  onChange={(e) => setProductTier(e.target.value as ProductTier)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:border-zinc-950 dark:focus:border-zinc-200 rounded-lg text-xs font-semibold text-zinc-950 dark:text-white outline-none cursor-pointer"
                >
                  <option value="water">Packaged Drinking Water (IS 14543)</option>
                  <option value="cement">Cement & Pozzolana (IS 269 / IS 1489)</option>
                  <option value="steel">Structural TMT Steel Rebars (IS 1786)</option>
                  <option value="electronics">IT / Telecom / Adapters (IS 13252 CRS)</option>
                  <option value="toys">Toys & Children Goods (IS 9873)</option>
                  <option value="general">General Consumer & Industrial Goods</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Factory Audit Man-Days:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setAuditDays(days)}
                      disabled={schemeType === 'scheme-2-crs'}
                      className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        auditDays === days && schemeType !== 'scheme-2-crs'
                          ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-950'
                          : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed'
                      }`}
                    >
                      {days} {days === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Itemized Cost Receipt */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-950 text-white p-6 rounded-2xl border border-zinc-800 shadow-xl space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-xl text-white">
                [ Cost Breakdown ]
              </h3>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] uppercase border border-zinc-700 font-mono">
                INR (₹)
              </span>
            </div>

            {/* Concession Notice Tag */}
            {calculation.concessionRate > 0 && (
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300">
                <span className="font-bold block text-white">[ {calculation.concessionLabel} ]</span>
                <span className="text-[11px] text-zinc-400">
                  Saves estimated ₹{calculation.totalDiscount.toLocaleString('en-IN')} on statutory BIS fees.
                </span>
              </div>
            )}

            {/* Line Items */}
            <div className="space-y-3 text-xs text-zinc-300 divide-y divide-zinc-900 pt-1">
              <div className="flex justify-between items-center pt-2">
                <span className="text-zinc-400">1. Application Fee</span>
                <div className="text-right">
                  {calculation.concessionRate > 0 && (
                    <span className="line-through text-zinc-600 mr-2 text-[11px]">
                      ₹{calculation.baseAppFee.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="font-bold text-white">
                    ₹{calculation.netAppFee.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <span className="text-zinc-400">2. Factory Inspection Audit</span>
                  <span className="block text-[10px] text-zinc-500 font-sans">
                    {schemeType === 'scheme-2-crs' ? 'Not mandatory for CRS' : `${auditDays} man-days @ ₹7,000/day`}
                  </span>
                </div>
                <div className="text-right">
                  {calculation.concessionRate > 0 && calculation.totalAuditFee > 0 && (
                    <span className="line-through text-zinc-600 mr-2 text-[11px]">
                      ₹{calculation.totalAuditFee.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="font-bold text-white">
                    ₹{calculation.netAuditFee.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <span className="text-zinc-400">3. Lab Testing Estimate</span>
                  <span className="block text-[10px] text-zinc-500 font-sans">
                    Paid to NABL / BIS Recognized Labs
                  </span>
                </div>
                <span className="font-bold text-white">
                  ₹{calculation.netTestingFee.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <span className="text-zinc-400">4. Minimum Marking Fee (Advance)</span>
                  <span className="block text-[10px] text-zinc-500 font-sans">
                    {schemeType === 'scheme-2-crs' ? '2-Year Portal Registration' : '1st Year Advance Marking'}
                  </span>
                </div>
                <div className="text-right">
                  {calculation.concessionRate > 0 && (
                    <span className="line-through text-zinc-600 mr-2 text-[11px]">
                      ₹{calculation.baseMarkingFee.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="font-bold text-white">
                    ₹{calculation.netMarkingFee.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-zinc-400">
                <span>Estimated 18% GST (Govt Fees)</span>
                <span>₹{calculation.estimatedGst.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Total Block */}
            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-zinc-400 uppercase tracking-wider">
                  Total Estimated 1st Year:
                </span>
                <span className="text-3xl font-serif text-white">
                  ₹{calculation.grandTotalFirstYear.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs text-zinc-400">
                <span>Estimated Annual Renewal:</span>
                <span className="font-bold text-zinc-200">
                  ₹{calculation.estimatedAnnualRenewal.toLocaleString('en-IN')}/yr
                </span>
              </div>
            </div>

            {/* External Verification link */}
            <div className="pt-2">
              <a
                href="https://www.manakonline.in"
                target="_blank"
                rel="noreferrer noopener"
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold rounded-xl flex items-center justify-center transition-colors border border-zinc-700 uppercase tracking-wider"
              >
                [ Verify on Official Manakonline Portal → ]
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Disclaimer Banner */}
      <div className="p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs font-mono text-zinc-700 dark:text-zinc-300">
        <span className="font-bold uppercase">[ STATUTORY NOTICE & INDICATIVE FEE SCHEDULE ]: </span>
        Fees presented in this estimator are baseline approximations derived from the official Bureau of Indian Standards (Conformity Assessment) Regulations and MSME notification guidelines. Exact testing fees depend on the selected laboratory, sample transportation, and actual production volume unit scales. Refer to{' '}
        <a
          href="https://www.manakonline.in"
          target="_blank"
          rel="noreferrer noopener"
          className="text-zinc-950 dark:text-white underline font-bold"
        >
          manakonline.in
        </a>{' '}
        for binding fee schedules.
      </div>
    </div>
  );
};
export default FeeEstimator;
