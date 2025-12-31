
import React from 'react';
import { PlantInfo, VastuDetails, HealthAssessment } from '../types';
import { SunIcon, WaterIcon, ThermometerIcon, LeafIcon, SparklesIcon, ShareIcon, VastuIcon, SoilIcon, FertilizerIcon } from './Icons';

interface PlantDetailsProps {
  plant: PlantInfo;
  imagePreviewUrl: string;
}

const PlantDetails: React.FC<PlantDetailsProps> = ({ plant, imagePreviewUrl }) => {
  const handleShare = async () => {
    const shareData = {
      title: `Check out this ${plant.commonName}!`,
      text: `I just identified a ${plant.commonName} (${plant.scientificName}) using FloraVeda AI! Here are some care tips: ${plant.shortDescription}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        alert("Plant details copied to clipboard!");
      } catch (err) {
        console.error('Failed to copy to clipboard', err);
      }
    }
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-white/20 shadow-2xl animate-fade-in-up">
      {/* Hero Image Section */}
      <div className="relative h-96 md:h-[28rem] overflow-hidden group bg-[#022c22]">
        {imagePreviewUrl ? (
          <img 
            src={imagePreviewUrl} 
            alt={plant.commonName} 
            className="w-full h-full object-cover animate-sway origin-bottom transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-jungle-800 to-emerald-900 animate-gradient-x p-6 text-center relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            {/* Content Container */}
            <div className="z-10 flex flex-col items-center space-y-6 max-w-sm w-full">
               <div className="p-4 rounded-full bg-white/10 mb-2 animate-sway">
                 <LeafIcon className="w-12 h-12 text-jungle-300" />
               </div>
               <div className="space-y-1 text-center">
                 <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">No Photo Provided</p>
               </div>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-[#022c22]/50 to-transparent pointer-events-none"></div>
        
        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all text-white font-medium group cursor-pointer"
        >
          <ShareIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-sm">Share</span>
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
          <div className="flex items-center space-x-2 mb-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
             <span className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/20 shadow-lg ${imagePreviewUrl ? 'bg-jungle-500/80' : 'bg-indigo-500/80'}`}>
               {imagePreviewUrl ? (
                 <span className="flex items-center gap-1">
                   <SparklesIcon className="w-3 h-3" /> Verified Match
                 </span>
               ) : (
                 <span className="flex items-center gap-1">
                   <LeafIcon className="w-3 h-3" /> Manual Entry
                 </span>
               )}
             </span>
          </div>
          <h2 className="text-4xl font-display font-bold mb-1 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {plant.commonName}
          </h2>
          <p className="text-jungle-300 font-medium text-lg italic opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {plant.scientificName}
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        <div>
          <p className="text-gray-200 text-lg leading-relaxed font-light opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {plant.shortDescription}
          </p>
        </div>
        
        {/* HEALTH SCAN CARD - NEW FEATURE */}
        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
           <HealthCard assessment={plant.healthAssessment} />
        </div>

        {/* Vastu Summary - Added Feature */}
        {plant.vastuDetails && (
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.58s' }}>
                <div className="bg-purple-900/20 border border-purple-500/20 p-5 rounded-2xl flex items-start gap-4 backdrop-blur-sm">
                    <div className="bg-purple-500/20 p-2 rounded-xl shrink-0 text-purple-300 mt-1">
                        <SparklesIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-purple-300 uppercase tracking-widest mb-1.5">Vastu Quick Insight</h4>
                        <p className="text-purple-100/90 leading-relaxed text-sm">
                            Channel <span className="text-white font-bold">{plant.vastuDetails.energyType}</span> energy by placing this plant in the <span className="text-emerald-300 font-bold">{plant.vastuDetails.bestDirections.join(' or ')}</span> of your space.
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* Detailed Vastu Shastra Section */}
        {plant.vastuDetails && (
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
             <VastuCompassSection vastu={plant.vastuDetails} />
          </div>
        )}

        {/* Fallback Vastu (if new structure missing) */}
        {!plant.vastuDetails && plant.vastuTips && (
           <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 p-6 rounded-2xl opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <h3 className="text-xl font-display font-bold text-purple-200 mb-3 flex items-center">
                <VastuIcon className="w-6 h-6 mr-2 text-purple-300" />
                Vastu Shastra
              </h3>
              <p className="text-purple-100/90 leading-relaxed italic">
                "{plant.vastuTips}"
              </p>
           </div>
        )}

        {/* Step-by-Step Guide */}
        <div className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.65s' }}>
          <h3 className="text-2xl font-display font-bold text-white border-b border-white/10 pb-2">
            Simple Step-by-Step Guide
          </h3>
          <div className="space-y-3">
            {plant.stepByStepGuide.map((step, index) => (
              <div key={index} className="flex items-start space-x-4 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex-shrink-0 bg-jungle-500/20 text-jungle-300 font-bold px-3 py-1 rounded-lg text-sm border border-jungle-500/30">
                  {index + 1}
                </div>
                <p className="text-gray-200 leading-relaxed">
                  {step.replace(/^Point \d+:\s*/i, '')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Care Instructions */}
        <div className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <h3 className="text-2xl font-display font-bold text-white border-b border-white/10 pb-2">
            Detailed Care Instructions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CareCard 
              icon={<WaterIcon className="w-6 h-6 text-blue-300" />} 
              title="Watering" 
              text={plant.careInstructions.water} 
            />
            <CareCard 
              icon={<SunIcon className="w-6 h-6 text-amber-300" />} 
              title="Sunlight" 
              text={plant.careInstructions.sunlight} 
            />
            <CareCard 
              icon={<ThermometerIcon className="w-6 h-6 text-rose-300" />} 
              title="Temperature" 
              text={plant.careInstructions.temperature} 
            />
            <CareCard 
              icon={<SoilIcon className="w-6 h-6 text-amber-600" />} 
              title="Soil" 
              text={plant.careInstructions.soil} 
            />
            <CareCard 
              icon={<FertilizerIcon className="w-6 h-6 text-purple-300" />} 
              title="Fertilizer" 
              text={plant.careInstructions.fertilizer} 
            />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-jungle-500/30 bg-jungle-500/10 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
          <h3 className="font-bold text-jungle-300 mb-2 flex items-center text-lg font-display">
            <span className="text-2xl mr-3">💡</span> Fun Fact
          </h3>
          <p className="text-gray-200">{plant.funFact}</p>
        </div>

        {plant.toxicity && (
           <div className="text-sm text-red-200 bg-red-900/40 p-4 rounded-xl border border-red-500/30 flex items-start opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
             <span className="mr-3 text-xl">⚠️</span>
             <span className="mt-1">{plant.toxicity}</span>
           </div>
        )}
      </div>
    </div>
  );
};

// --- Sub Components ---

const HealthCard = ({ assessment }: { assessment: HealthAssessment }) => {
    if (!assessment) return null;

    const isHealthy = assessment.status === 'HEALTHY';
    const isSick = assessment.status === 'SICK';
    
    // Status config
    const statusConfig = {
        HEALTHY: { 
            color: 'text-emerald-300', 
            bg: 'bg-emerald-500/10', 
            border: 'border-emerald-500/30', 
            icon: '✨',
            title: 'In Good Health'
        },
        SICK: { 
            color: 'text-red-300', 
            bg: 'bg-red-500/10', 
            border: 'border-red-500/30', 
            icon: '🚑',
            title: 'Critical Attention Needed'
        },
        NEEDS_ATTENTION: { 
            color: 'text-amber-300', 
            bg: 'bg-amber-500/10', 
            border: 'border-amber-500/30', 
            icon: '🩺',
            title: 'Needs Attention'
        }
    };

    const config = statusConfig[assessment.status] || statusConfig.NEEDS_ATTENTION;

    return (
        <div className={`rounded-2xl border ${config.border} ${config.bg} p-6 overflow-hidden relative group transition-all duration-300`}>
             <div className="absolute top-0 right-0 p-16 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
             
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl bg-white/10 p-2 rounded-lg">{config.icon}</span>
                        <div>
                            <h3 className={`text-xl font-display font-bold ${config.color}`}>Dr. Green's Diagnosis</h3>
                            <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{config.title}</p>
                        </div>
                    </div>
                    <div className="text-right">
                         <div className="flex justify-end items-end mb-1 space-x-2">
                             <span className="text-xs text-white/50 uppercase tracking-wider mb-0.5">Confidence</span>
                             <span className={`text-lg font-bold ${config.color}`}>{assessment.confidence}%</span>
                        </div>
                        <div className="w-24 h-1.5 bg-black/20 rounded-full overflow-hidden border border-white/10 ml-auto">
                            <div 
                                className={`h-full ${isHealthy ? 'bg-emerald-400' : isSick ? 'bg-red-400' : 'bg-amber-400'} rounded-full`} 
                                style={{ width: `${assessment.confidence}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Issues Tags */}
                    {assessment.issues.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {assessment.issues.map((issue, i) => (
                                <span key={i} className={`px-3 py-1 rounded-lg bg-black/20 ${config.color} text-sm font-medium border border-white/5 flex items-center`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-2"></span>
                                    {issue}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Detailed Diagnosis */}
                    {assessment.detailedDiagnosis && (
                      <div className="bg-black/10 rounded-xl p-4 border border-white/5">
                        <p className="text-xs uppercase tracking-wider text-white/50 font-bold mb-2">Condition Analysis</p>
                        <p className="text-white/90 leading-relaxed font-light text-sm">
                           {assessment.detailedDiagnosis}
                        </p>
                      </div>
                    )}

                    {/* Potential Pests Alert */}
                    {assessment.potentialPests && assessment.potentialPests.length > 0 && (
                        <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                             <div className="text-2xl mt-0.5">🪲</div>
                             <div>
                                 <h4 className="text-red-200 font-bold text-sm uppercase tracking-wider mb-1">Pest Alert Identified</h4>
                                 <p className="text-red-100/80 text-sm">
                                     Potential infestation detected: <span className="font-bold text-white">{assessment.potentialPests.join(', ')}</span>.
                                 </p>
                             </div>
                        </div>
                    )}

                    {/* Actionable Steps Checklist */}
                    {assessment.actionableSteps && assessment.actionableSteps.length > 0 && (
                        <div>
                             <p className="text-xs uppercase tracking-wider text-white/50 font-bold mb-3">Action Plan & Remedy</p>
                             <div className="space-y-2">
                                {assessment.actionableSteps.map((step, idx) => (
                                   <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                       <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center border ${isHealthy ? 'border-emerald-500/50 text-emerald-400' : 'border-amber-500/50 text-amber-400'}`}>
                                           <span className="text-xs font-bold">{idx + 1}</span>
                                       </div>
                                       <p className="text-gray-200 text-sm leading-relaxed">{step}</p>
                                   </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {/* Fallback for old data structure if actionableSteps is missing */}
                    {!assessment.actionableSteps && (
                        <div>
                           <p className="text-xs uppercase tracking-wider text-white/50 font-bold mb-2">Remedy</p>
                           <p className="text-white/90 leading-relaxed font-light p-3 bg-black/10 rounded-xl border border-white/5">{assessment.remedy}</p>
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
};

const CareCard = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => (
  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors duration-300 h-full flex flex-col">
    <div className="flex items-center space-x-3 mb-3">
      <div className="bg-white/10 p-2 rounded-lg shrink-0">
        {icon}
      </div>
      <h4 className="font-bold text-gray-100 font-display tracking-wide">{title}</h4>
    </div>
    <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
  </div>
);

// --- Vastu Component ---

const VastuCompassSection = ({ vastu }: { vastu: VastuDetails }) => {
  return (
    <div className="rounded-3xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-[#1a1033] to-[#2d1b4e] shadow-lg relative">
        <div className="absolute top-0 right-0 p-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="p-6 md:p-8 relative z-10">
            <div className="flex items-center gap-3 mb-6">
                 <div className="bg-purple-500/20 p-2.5 rounded-xl">
                    <VastuIcon className="w-6 h-6 text-purple-300" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-display font-bold text-white">Vastu Shastra Analysis</h3>
                    <p className="text-purple-200 text-sm">Energy Alignment & Placement</p>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Visual Compass */}
                <div className="flex flex-col items-center justify-center">
                    <CompassDiagram best={vastu.bestDirections} avoid={vastu.avoidDirections} />
                    <div className="mt-4 flex gap-4 text-xs font-medium">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                            <span className="text-emerald-100">Optimal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500/50"></span>
                            <span className="text-red-100/70">Avoid</span>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <h4 className="text-purple-300 text-sm font-bold uppercase tracking-wider mb-2">Energy Type</h4>
                        <p className="text-white text-lg font-display">{vastu.energyType}</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-purple-300 text-sm font-bold uppercase tracking-wider">Placement Guide</h4>
                        <p className="text-gray-200 leading-relaxed font-light">
                            {vastu.placementReason}
                        </p>
                    </div>

                    <div className="pt-2">
                        <h4 className="text-purple-300 text-sm font-bold uppercase tracking-wider mb-2">Best Directions</h4>
                        <div className="flex flex-wrap gap-2">
                            {vastu.bestDirections.map((dir) => (
                                <span key={dir} className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-sm font-medium">
                                    {dir}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const CompassDiagram = ({ best, avoid }: { best: string[], avoid: string[] }) => {
    // 8 Directions starting from North (Top)
    // Order: N, NE, E, SE, S, SW, W, NW
    const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
    const shortDirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    
    // SVG Geometry
    const size = 260;
    const center = size / 2;
    const radius = 100;
    const innerRadius = 30; // Donut hole
    
    // Helper to calculate arc
    const createArc = (index: number, total: number) => {
        const startAngle = (index * 360) / total - 90 - (360/total/2);
        const endAngle = ((index + 1) * 360) / total - 90 - (360/total/2);
        
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        
        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);

        const x1_in = center + innerRadius * Math.cos(startRad);
        const y1_in = center + innerRadius * Math.sin(startRad);
        const x2_in = center + innerRadius * Math.cos(endRad);
        const y2_in = center + innerRadius * Math.sin(endRad);
        
        // SVG Path command
        return `M ${x1_in} ${y1_in} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} L ${x2_in} ${y2_in} A ${innerRadius} ${innerRadius} 0 0 0 ${x1_in} ${y1_in} Z`;
    };

    const getTextPos = (index: number, total: number) => {
        const angle = (index * 360) / total - 90;
        const rad = (angle * Math.PI) / 180;
        const textRadius = radius + 25;
        return {
            x: center + textRadius * Math.cos(rad),
            y: center + textRadius * Math.sin(rad)
        };
    };

    return (
        <div className="relative w-64 h-64">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="animate-spin-slow-custom">
                {/* Background Circle */}
                <circle cx={center} cy={center} r={radius + 5} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                
                {directions.map((dir, i) => {
                    // Check logic
                    const isBest = best.some(d => d.toLowerCase().replace('-', '') === dir.toLowerCase().replace('-', ''));
                    const isAvoid = avoid.some(d => d.toLowerCase().replace('-', '') === dir.toLowerCase().replace('-', ''));
                    
                    let fillColor = "rgba(255, 255, 255, 0.05)"; // Neutral
                    let strokeColor = "rgba(255, 255, 255, 0.1)";
                    
                    if (isBest) {
                        fillColor = "rgba(16, 185, 129, 0.6)"; // Emerald 500
                        strokeColor = "rgba(16, 185, 129, 0.8)";
                    } else if (isAvoid) {
                        fillColor = "rgba(239, 68, 68, 0.15)"; // Red 500
                        strokeColor = "rgba(239, 68, 68, 0.3)";
                    }

                    const textPos = getTextPos(i, 8);

                    return (
                        <g key={dir} className="transition-all duration-500 hover:opacity-80">
                            <path 
                                d={createArc(i, 8)} 
                                fill={fillColor} 
                                stroke={strokeColor} 
                                strokeWidth="1"
                                className="transition-colors duration-500"
                            />
                            {/* Direction Labels */}
                            <text 
                                x={textPos.x} 
                                y={textPos.y} 
                                textAnchor="middle" 
                                dominantBaseline="middle" 
                                fill={isBest ? "#6ee7b7" : "rgba(255,255,255,0.5)"}
                                className={`text-[10px] font-bold tracking-widest ${isBest ? 'font-bold' : 'font-normal'}`}
                                style={{ fontSize: '11px' }}
                            >
                                {shortDirs[i]}
                            </text>
                        </g>
                    );
                })}
                
                {/* Center Decorative */}
                <circle cx={center} cy={center} r={innerRadius - 5} fill="#1a1033" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
                <foreignObject x={center - 12} y={center - 12} width="24" height="24">
                     <div className="w-full h-full flex items-center justify-center text-purple-300">
                        <VastuIcon className="w-4 h-4" />
                     </div>
                </foreignObject>
            </svg>
        </div>
    );
};

export default PlantDetails;
