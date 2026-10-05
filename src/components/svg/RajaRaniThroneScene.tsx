import React from 'react';

interface RajaRaniThroneSceneProps {
  step: 'walking' | 'seated';
  kingName: string;
  queenName?: string;
  className?: string;
}

export const RajaRaniThroneScene: React.FC<RajaRaniThroneSceneProps> = ({
  step,
  kingName,
  queenName = 'Her Royal Highness',
  className = 'w-full max-w-2xl mx-auto',
}) => {
  const isSeated = step === 'seated';

  return (
    <div className={`relative ${className} select-none`}>
      <svg
        viewBox="0 0 640 440"
        className="w-full h-auto drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Shading */}
          <linearGradient id="kingGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="25%" stopColor="#FFD700" />
            <stop offset="60%" stopColor="#B58A42" />
            <stop offset="100%" stopColor="#78551E" />
          </linearGradient>

          <linearGradient id="queenGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDE6" />
            <stop offset="30%" stopColor="#FFE066" />
            <stop offset="70%" stopColor="#C99427" />
            <stop offset="100%" stopColor="#875815" />
          </linearGradient>

          <linearGradient id="brightGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9D2" />
            <stop offset="50%" stopColor="#FFDE59" />
            <stop offset="100%" stopColor="#C99427" />
          </linearGradient>

          {/* King Crimson Velvet */}
          <linearGradient id="crimsonVelvet" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E63946" />
            <stop offset="40%" stopColor="#B94738" />
            <stop offset="100%" stopColor="#5E140B" />
          </linearGradient>

          {/* Queen Royal Magenta / Rose Velvet */}
          <linearGradient id="queenVelvet" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF4D80" />
            <stop offset="40%" stopColor="#C2185B" />
            <stop offset="100%" stopColor="#5C0029" />
          </linearGradient>

          {/* Queen Royal Emerald Saree */}
          <linearGradient id="emeraldSilk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#48CAE4" />
            <stop offset="40%" stopColor="#0077B6" />
            <stop offset="100%" stopColor="#03045E" />
          </linearGradient>

          {/* Queen Saree Magenta Border */}
          <linearGradient id="sareePink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF758F" />
            <stop offset="50%" stopColor="#C9184A" />
            <stop offset="100%" stopColor="#800F2F" />
          </linearGradient>

          {/* Royal Silk Ivory */}
          <linearGradient id="silkIvory" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FFF8EF" />
            <stop offset="100%" stopColor="#E8DACB" />
          </linearGradient>

          {/* Carpet Gradient */}
          <linearGradient id="redCarpet" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8A1C14" />
            <stop offset="50%" stopColor="#B94738" />
            <stop offset="100%" stopColor="#D93829" />
          </linearGradient>

          {/* Torch Flame Gradient */}
          <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FF3B30" />
            <stop offset="50%" stopColor="#FF9500" />
            <stop offset="100%" stopColor="#FFCC00" />
          </linearGradient>

          {/* Twin Halo Glow */}
          <radialGradient id="kingAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FF9500" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF9500" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="queenAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB3C6" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FF4D80" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF4D80" stopOpacity="0" />
          </radialGradient>

          {/* Drop Shadows */}
          <filter id="sceneShadow" x="-10%" y="-10%" width="120%" height="125%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#211710" floodOpacity="0.45" />
          </filter>

          <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================= BACKGROUND PALACE WALLS & ARCHES ================= */}
        {/* Outer Grand Palace Arch */}
        <path
          d="M40 430 L40 120 Q320 15 600 120 L600 430 Z"
          fill="#F5EBDD"
          stroke="#D8C3A5"
          strokeWidth="3.5"
        />

        {/* Inner Arch Inset */}
        <path
          d="M75 430 L75 140 Q320 45 565 140 L565 430 Z"
          fill="#FFF8EF"
          stroke="#BFA886"
          strokeWidth="2.5"
        />

        {/* Glowing Auroras when Seated */}
        {isSeated && (
          <g opacity="0.4" filter="url(#glowFilter)">
            {/* King Halo */}
            <circle cx="210" cy="180" r="115" fill="url(#kingAura)" />
            {/* Queen Halo */}
            <circle cx="430" cy="180" r="115" fill="url(#queenAura)" />
          </g>
        )}

        {/* Palace Velvet Draperies */}
        <path d="M40 90 Q90 100 80 230 Q50 180 40 90 Z" fill="url(#crimsonVelvet)" stroke="#B58A42" strokeWidth="2" />
        <path d="M600 90 Q550 100 560 230 Q590 180 600 90 Z" fill="url(#queenVelvet)" stroke="#B58A42" strokeWidth="2" />
        {/* Golden Tassels */}
        <circle cx="75" cy="195" r="4.5" fill="url(#kingGold)" />
        <line x1="75" y1="195" x2="75" y2="220" stroke="#FFD700" strokeWidth="2" />
        <circle cx="565" cy="195" r="4.5" fill="url(#queenGold)" />
        <line x1="565" y1="195" x2="565" y2="220" stroke="#FFD700" strokeWidth="2" />

        {/* ================= TORCHES ================= */}
        {/* Left Torch */}
        <g>
          <rect x="52" y="240" width="12" height="150" fill="url(#kingGold)" stroke="#78551E" strokeWidth="1.5" rx="3" />
          <polygon points="46,240 70,240 64,225 52,225" fill="url(#kingGold)" stroke="#FFE89E" />
          <path d="M58 202 Q65 215 58 225 Q51 215 58 202 Z" fill="url(#flameGrad)" className="animate-pulse" />
          <circle cx="58" cy="220" r="16" fill="url(#kingAura)" opacity="0.6" />
        </g>

        {/* Right Torch */}
        <g>
          <rect x="576" y="240" width="12" height="150" fill="url(#queenGold)" stroke="#78551E" strokeWidth="1.5" rx="3" />
          <polygon points="570,240 594,240 588,225 576,225" fill="url(#queenGold)" stroke="#FFE89E" />
          <path d="M582 202 Q589 215 582 225 Q575 215 582 202 Z" fill="url(#flameGrad)" className="animate-pulse" />
          <circle cx="582" cy="220" r="16" fill="url(#queenAura)" opacity="0.6" />
        </g>

        {/* ================= PODIUM DAIS & GRAND RED CARPET ================= */}
        {/* Step 1 (Bottom) */}
        <polygon points="55,420 585,420 565,390 75,390" fill="#D8C3A5" stroke="#B58A42" strokeWidth="2" />
        {/* Step 2 (Middle) */}
        <polygon points="85,390 555,390 535,365 105,365" fill="#BFA886" stroke="#8C682A" strokeWidth="2" />
        {/* Step 3 (Top Dais) */}
        <polygon points="115,365 525,365 505,340 135,340" fill="#D8C3A5" stroke="#B58A42" strokeWidth="2" />

        {/* Grand Red Carpet leading to BOTH thrones */}
        <polygon points="175,340 465,340 500,435 140,435" fill="url(#redCarpet)" stroke="#FFD700" strokeWidth="3" />
        <line x1="185" y1="342" x2="152" y2="430" stroke="#FFE89E" strokeWidth="2" strokeDasharray="8 5" />
        <line x1="455" y1="342" x2="488" y2="430" stroke="#FFE89E" strokeWidth="2" strokeDasharray="8 5" />

        {/* ================= 1. KING'S THRONE (LEFT - சிம்மாசனம்) ================= */}
        <g filter="url(#sceneShadow)">
          {/* Backrest Arch */}
          <path
            d="M135 325 L135 155 Q205 75 275 155 L275 325 Z"
            fill="url(#kingGold)"
            stroke="#FFF4B8"
            strokeWidth="3"
          />
          {/* King Crown Peak Finial */}
          <polygon points="205,72 195,95 215,95" fill="url(#kingGold)" stroke="#FFF4B8" strokeWidth="2" />
          <circle cx="205" cy="85" r="5" fill="#E63946" stroke="#FFD700" strokeWidth="1" />

          {/* Velvet Cushion */}
          <path
            d="M148 310 L148 165 Q205 100 262 165 L262 310 Z"
            fill="url(#crimsonVelvet)"
            stroke="#B58A42"
            strokeWidth="2"
          />
          {/* Tufted Golden Buttons */}
          <circle cx="205" cy="140" r="3" fill="#FFD700" />
          <circle cx="180" cy="170" r="3" fill="#FFD700" />
          <circle cx="230" cy="170" r="3" fill="#FFD700" />
          <circle cx="205" cy="200" r="3" fill="#FFD700" />
          <circle cx="180" cy="230" r="3" fill="#FFD700" />
          <circle cx="230" cy="230" r="3" fill="#FFD700" />

          {/* Seat Cushion */}
          <rect x="130" y="280" width="150" height="35" rx="8" fill="url(#crimsonVelvet)" stroke="#B58A42" strokeWidth="2" />

          {/* Armrests */}
          <path d="M120 245 C120 230 142 230 142 250 L142 298 L120 298 Z" fill="url(#kingGold)" stroke="#FFE89E" strokeWidth="1.5" />
          <circle cx="131" cy="240" r="8" fill="url(#kingGold)" />
          <path d="M268 250 C268 230 290 230 290 245 L290 298 L268 298 Z" fill="url(#kingGold)" stroke="#FFE89E" strokeWidth="1.5" />
          <circle cx="279" cy="240" r="8" fill="url(#kingGold)" />

          {/* Legs */}
          <rect x="132" y="315" width="16" height="22" rx="2" fill="url(#kingGold)" stroke="#78551E" strokeWidth="1.5" />
          <rect x="262" y="315" width="16" height="22" rx="2" fill="url(#kingGold)" stroke="#78551E" strokeWidth="1.5" />
        </g>

        {/* ================= 2. QUEEN'S THRONE (RIGHT - ராணி சிம்மாசனம்) ================= */}
        <g filter="url(#sceneShadow)">
          {/* Backrest Arch with Lotus / Peacock styling */}
          <path
            d="M365 325 L365 155 Q435 75 505 155 L505 325 Z"
            fill="url(#queenGold)"
            stroke="#FFFDE6"
            strokeWidth="3"
          />
          {/* Queen Lotus Peak Finial */}
          <path d="M435 68 C425 80 435 95 435 95 C435 95 445 80 435 68 Z" fill="#FF4D80" stroke="#FFD700" strokeWidth="1.5" />
          <circle cx="435" cy="85" r="4" fill="#0077B6" />

          {/* Velvet Cushion in Royal Magenta/Rose */}
          <path
            d="M378 310 L378 165 Q435 100 492 165 L492 310 Z"
            fill="url(#queenVelvet)"
            stroke="#C2185B"
            strokeWidth="2"
          />
          {/* Pearl & Jewel Buttons */}
          <circle cx="435" cy="140" r="3" fill="#FFFDE6" />
          <circle cx="410" cy="170" r="3" fill="#FFFDE6" />
          <circle cx="460" cy="170" r="3" fill="#FFFDE6" />
          <circle cx="435" cy="200" r="3" fill="#FFFDE6" />
          <circle cx="410" cy="230" r="3" fill="#FFFDE6" />
          <circle cx="460" cy="230" r="3" fill="#FFFDE6" />

          {/* Seat Cushion */}
          <rect x="360" y="280" width="150" height="35" rx="8" fill="url(#queenVelvet)" stroke="#C2185B" strokeWidth="2" />

          {/* Armrests with Pearl Finials */}
          <path d="M350 245 C350 230 372 230 372 250 L372 298 L350 298 Z" fill="url(#queenGold)" stroke="#FFFDE6" strokeWidth="1.5" />
          <circle cx="361" cy="240" r="8" fill="url(#queenGold)" />
          <path d="M498 250 C498 230 520 230 520 245 L520 298 L498 298 Z" fill="url(#queenGold)" stroke="#FFFDE6" strokeWidth="1.5" />
          <circle cx="509" cy="240" r="8" fill="url(#queenGold)" />

          {/* Legs */}
          <rect x="362" y="315" width="16" height="22" rx="2" fill="url(#queenGold)" stroke="#875815" strokeWidth="1.5" />
          <rect x="492" y="315" width="16" height="22" rx="2" fill="url(#queenGold)" stroke="#875815" strokeWidth="1.5" />
        </g>

        {/* ================= ROYAL FIGURES (RAJA & RANI) ================= */}
        {isSeated ? (
          /* ============= STATE A: BOTH RAJA & RANI SEATED IN MAJESTY ============= */
          <g filter="url(#sceneShadow)">
            {/* ------------ 1. RAJA (KING) SEATED ------------ */}
            <g>
              {/* Cape */}
              <path
                d="M158 220 Q120 275 125 345 Q205 358 285 345 Q290 275 252 220 Z"
                fill="url(#crimsonVelvet)"
                stroke="#B58A42"
                strokeWidth="2"
              />
              {/* Ermine Trim */}
              <path d="M125 345 Q205 358 285 345 L282 336 Q205 348 128 336 Z" fill="#FFF8EF" />
              <circle cx="150" cy="342" r="1.5" fill="#211710" />
              <circle cx="205" cy="348" r="1.5" fill="#211710" />
              <circle cx="260" cy="342" r="1.5" fill="#211710" />

              {/* Legs / Robe */}
              <path d="M168 275 L168 330 Q205 338 242 330 L242 275 Z" fill="url(#silkIvory)" stroke="#B58A42" strokeWidth="1.5" />
              <ellipse cx="188" cy="332" rx="12" ry="6" fill="url(#kingGold)" />
              <ellipse cx="222" cy="332" rx="12" ry="6" fill="url(#kingGold)" />

              {/* Torso */}
              <path d="M174 212 Q205 216 236 212 L240 278 Q205 284 170 278 Z" fill="url(#silkIvory)" stroke="#B58A42" strokeWidth="2" />
              <rect x="174" y="260" width="62" height="10" rx="3" fill="url(#kingGold)" />
              <circle cx="205" cy="265" r="4" fill="#E63946" />

              {/* Necklaces */}
              <path d="M185 220 Q205 240 225 220" stroke="#FFD700" strokeWidth="2.5" fill="none" />
              <circle cx="205" cy="235" r="3.5" fill="#2A9D8F" />

              {/* Left Hand on Armrest */}
              <path d="M175 216 L142 238 L138 248" stroke="url(#silkIvory)" strokeWidth="13" strokeLinecap="round" />
              <circle cx="138" cy="240" r="6" fill="#E8C39E" />
              <circle cx="144" cy="240" r="4" fill="url(#kingGold)" />

              {/* Right Hand Holding Sengol */}
              <path d="M235 216 L265 238 L270 248" stroke="url(#silkIvory)" strokeWidth="13" strokeLinecap="round" />
              <circle cx="270" cy="240" r="6" fill="#E8C39E" />
              <circle cx="264" cy="240" r="4" fill="url(#kingGold)" />

              {/* King's Sengol (Scepter) */}
              <g filter="url(#glowFilter)">
                <line x1="272" y1="155" x2="272" y2="295" stroke="url(#brightGold)" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="272" cy="155" r="8" fill="url(#kingGold)" stroke="#FFF4B8" strokeWidth="1.5" />
                <polygon points="272,138 266,150 278,150" fill="url(#brightGold)" stroke="#FFF4B8" />
                <circle cx="272" cy="153" r="3.5" fill="#E63946" className="animate-pulse" />
              </g>

              {/* Head & Face */}
              <ellipse cx="205" cy="188" rx="16" ry="18" fill="#E8C39E" stroke="#352820" strokeWidth="1.2" />
              <circle cx="199" cy="186" r="1.8" fill="#211710" />
              <circle cx="211" cy="186" r="1.8" fill="#211710" />
              <line x1="205" y1="174" x2="205" y2="182" stroke="#B94738" strokeWidth="2" strokeLinecap="round" />
              {/* Mustache */}
              <path d="M198 198 Q205 194 212 198 Q217 194 216 200 Q205 201 205 198 Q205 201 194 200 Q193 194 198 198 Z" fill="#211710" />
              <path d="M201 201 Q205 203 209 201" stroke="#78551E" strokeWidth="1" />

              {/* King's Crown */}
              <g filter="url(#glowFilter)">
                <rect x="189" y="167" width="32" height="8" rx="2" fill="url(#brightGold)" stroke="#FFF4B8" />
                <path d="M189 167 L191 152 L197 160 L205 136 L213 160 L219 152 L221 167 Z" fill="url(#brightGold)" stroke="#FFF4B8" strokeWidth="1.5" />
                <circle cx="205" cy="136" r="3.5" fill="#E63946" />
                <circle cx="191" cy="152" r="2.5" fill="#FFD700" />
                <circle cx="219" cy="152" r="2.5" fill="#FFD700" />
              </g>
            </g>

            {/* ------------ 2. RANI (QUEEN) SEATED ------------ */}
            <g>
              {/* Flowing Royal Saree Pleats Draped over Throne */}
              <path
                d="M390 220 Q350 275 355 345 Q435 358 515 345 Q520 275 480 220 Z"
                fill="url(#sareePink)"
                stroke="#B58A42"
                strokeWidth="2"
              />
              {/* Golden Saree Zaree Border (ஜரிகை கரை) */}
              <path d="M355 345 Q435 358 515 345 L512 337 Q435 349 358 337 Z" fill="url(#queenGold)" stroke="#FFE066" />

              {/* Seated Silk Saree Skirt & Anklets */}
              <path d="M400 275 L400 330 Q435 338 470 330 L470 275 Z" fill="url(#emeraldSilk)" stroke="#FFD700" strokeWidth="1.5" />
              <ellipse cx="420" cy="332" rx="10" ry="5" fill="url(#queenGold)" />
              <ellipse cx="450" cy="332" rx="10" ry="5" fill="url(#queenGold)" />

              {/* Saree Blouse & Pallu (முந்தானை) Drape across chest */}
              <path d="M410 215 Q435 218 460 215 L465 278 Q435 284 405 278 Z" fill="url(#emeraldSilk)" stroke="#FFD700" strokeWidth="1.5" />
              {/* Royal Pink & Gold Pallu across shoulder */}
              <path d="M405 218 Q430 245 455 275 L465 275 Q440 240 415 215 Z" fill="url(#sareePink)" stroke="url(#queenGold)" strokeWidth="1" />

              {/* Pearl Harams & Mangalsutra / Kasu Malai */}
              <path d="M418 222 Q435 240 452 222" stroke="#FFFDE6" strokeWidth="2.5" fill="none" />
              <path d="M414 230 Q435 252 456 230" stroke="#FFD700" strokeWidth="2" fill="none" />
              <circle cx="435" cy="245" r="3.5" fill="#E63946" stroke="#FFD700" strokeWidth="0.8" />

              {/* Right Arm & Hand Resting Gracefully on Armrest with Bangles */}
              <path d="M460 216 L492 238 L496 248" stroke="url(#emeraldSilk)" strokeWidth="12" strokeLinecap="round" />
              <circle cx="496" cy="240" r="5.5" fill="#F0CFB3" />
              <circle cx="490" cy="240" r="4" fill="url(#queenGold)" /> {/* Gold Glass Bangles */}

              {/* Left Hand holding Royal Golden Lotus Blossom (தாமரை மலர்) */}
              <path d="M410 216 L380 238 L376 248" stroke="url(#emeraldSilk)" strokeWidth="12" strokeLinecap="round" />
              <circle cx="376" cy="240" r="5.5" fill="#F0CFB3" />
              <circle cx="382" cy="240" r="4" fill="url(#queenGold)" />

              {/* Royal Golden Lotus Blossom */}
              <g filter="url(#glowFilter)">
                <circle cx="372" cy="235" r="6" fill="#FF758F" stroke="#FFD700" strokeWidth="1" />
                <path d="M372 226 C367 232 372 238 372 238 C372 238 377 232 372 226 Z" fill="#FFB3C6" />
                <circle cx="372" cy="235" r="2" fill="#FFD700" />
              </g>

              {/* Queen's Neck & Elegant Face */}
              <ellipse cx="435" cy="188" rx="14" ry="17" fill="#F0CFB3" stroke="#352820" strokeWidth="1" />
              {/* Queen's Bindi (சிவப்பு திலகம்) */}
              <circle cx="435" cy="182" r="2" fill="#C9184A" />
              {/* Eyes with Kajal & Gentle Royal Smile */}
              <circle cx="430" cy="187" r="1.6" fill="#211710" />
              <circle cx="440" cy="187" r="1.6" fill="#211710" />
              <path d="M431 196 Q435 199 439 196" stroke="#C9184A" strokeWidth="1.2" strokeLinecap="round" />

              {/* Jhumka Earrings */}
              <circle cx="421" cy="192" r="2.5" fill="url(#queenGold)" />
              <polygon points="421,194 418,200 424,200" fill="url(#queenGold)" />
              <circle cx="449" cy="192" r="2.5" fill="url(#queenGold)" />
              <polygon points="449,194 446,200 452,200" fill="url(#queenGold)" />

              {/* Queen's Crown / Tiara (ராணி கிரீடம்) */}
              <g filter="url(#glowFilter)">
                <rect x="421" y="169" width="28" height="7" rx="2" fill="url(#brightGold)" stroke="#FFFDE6" />
                <path d="M421 169 L425 158 L430 165 L435 145 L440 165 L445 158 L449 169 Z" fill="url(#brightGold)" stroke="#FFFDE6" strokeWidth="1.2" />
                <circle cx="435" cy="145" r="3" fill="#C9184A" />
                <circle cx="425" cy="158" r="2" fill="#48CAE4" />
                <circle cx="445" cy="158" r="2" fill="#48CAE4" />
              </g>

              {/* Shimmering Gold Saree Veil (ஒற்றை முந்தானை) behind Queen */}
              <path d="M422 172 Q405 210 408 260" stroke="#FFE066" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
              <path d="M448 172 Q465 210 462 260" stroke="#FFE066" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
            </g>
          </g>
        ) : (
          /* ============= STATE B: RAJA & RANI WALKING TOGETHER UP THE RED CARPET ============= */
          <g className="animate-throne-walk" filter="url(#sceneShadow)">
            {/* Common Walking Shadow */}
            <ellipse cx="320" cy="410" rx="70" ry="12" fill="#211710" opacity="0.4" />

            {/* Raja Walking (Left Side of Carpet) */}
            <g transform="translate(-50, 0)">
              {/* Cape */}
              <path d="M315 285 Q285 345 295 400 Q340 390 385 400 Q395 345 365 285 Z" fill="url(#crimsonVelvet)" stroke="#B58A42" strokeWidth="1.5" />
              <path d="M316 285 Q340 290 364 285 L370 380 Q340 387 310 380 Z" fill="url(#silkIvory)" stroke="#B58A42" strokeWidth="1.5" />
              <ellipse cx="326" cy="388" rx="9" ry="5" fill="url(#kingGold)" />
              <ellipse cx="354" cy="382" rx="9" ry="5" fill="url(#kingGold)" />
              {/* King Sengol */}
              <line x1="375" y1="245" x2="375" y2="365" stroke="url(#brightGold)" strokeWidth="3.5" />
              <circle cx="375" cy="245" r="6" fill="#E63946" />
              {/* Head & Crown */}
              <ellipse cx="340" cy="258" rx="14" ry="16" fill="#E8C39E" />
              <rect x="326" y="240" width="28" height="6" fill="url(#brightGold)" />
              <polygon points="326,240 329,228 335,235 340,218 345,235 351,228 354,240" fill="url(#brightGold)" />
              <circle cx="340" cy="218" r="2.5" fill="#E63946" />
            </g>

            {/* Rani Walking (Right Side of Carpet) */}
            <g transform="translate(50, 0)">
              {/* Flowing Saree */}
              <path d="M295 285 Q265 345 275 400 Q320 390 365 400 Q375 345 345 285 Z" fill="url(#sareePink)" stroke="url(#queenGold)" strokeWidth="1.5" />
              <path d="M296 285 Q320 290 344 285 L350 380 Q320 387 290 380 Z" fill="url(#emeraldSilk)" stroke="#FFD700" strokeWidth="1.5" />
              <ellipse cx="306" cy="388" rx="8" ry="4" fill="url(#queenGold)" />
              <ellipse cx="334" cy="382" rx="8" ry="4" fill="url(#queenGold)" />
              {/* Lotus in Hand */}
              <circle cx="282" cy="265" r="5" fill="#FF758F" />
              {/* Head & Crown */}
              <ellipse cx="320" cy="258" rx="13" ry="15" fill="#F0CFB3" />
              <circle cx="320" cy="253" r="1.5" fill="#C9184A" /> {/* Bindi */}
              <rect x="307" y="242" width="26" height="5" fill="url(#brightGold)" />
              <polygon points="307,242 312,232 316,238 320,222 324,238 328,232 333,242" fill="url(#brightGold)" />
              <circle cx="320" cy="222" r="2.5" fill="#FF4D80" />
            </g>
          </g>
        )}

        {/* ================= CORONATION PETALS & GOLD COIN SHOWER ================= */}
        {isSeated && (
          <g opacity="0.85">
            {/* Rose & Lotus Petals Falling across the Royal Couple */}
            <circle cx="150" cy="120" r="5" fill="#E63946" className="animate-bounce" />
            <circle cx="230" cy="70" r="4.5" fill="#FF758F" />
            <circle cx="320" cy="90" r="5" fill="#E63946" className="animate-bounce" />
            <circle cx="410" cy="75" r="4.5" fill="#FF758F" />
            <circle cx="490" cy="115" r="5" fill="#E63946" className="animate-bounce" />
            <circle cx="180" cy="260" r="4" fill="#FF758F" />
            <circle cx="460" cy="260" r="4" fill="#E63946" />
            <circle cx="270" cy="380" r="4.5" fill="#E63946" />
            <circle cx="370" cy="380" r="4.5" fill="#FF758F" />

            {/* Jasmine White Blossoms (மல்லிகைப் பூ) */}
            <circle cx="280" cy="110" r="3.5" fill="#FFFFFF" />
            <circle cx="360" cy="110" r="3.5" fill="#FFFFFF" />
            <circle cx="200" cy="330" r="3.5" fill="#FFFFFF" />
            <circle cx="440" cy="330" r="3.5" fill="#FFFFFF" />

            {/* Gold Coins (பொற்காசுகள்) */}
            <circle cx="170" cy="95" r="4" fill="#FFD700" stroke="#B58A42" />
            <circle cx="470" cy="95" r="4" fill="#FFD700" stroke="#B58A42" />
            <circle cx="320" cy="170" r="4" fill="#FFD700" stroke="#B58A42" />
            <circle cx="160" cy="310" r="3.5" fill="#FFD700" stroke="#B58A42" />
            <circle cx="480" cy="310" r="3.5" fill="#FFD700" stroke="#B58A42" />
          </g>
        )}
      </svg>
    </div>
  );
};
