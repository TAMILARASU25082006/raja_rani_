import React from 'react';

interface RealKingThroneSceneProps {
  step: 'walking' | 'seated';
  kingName: string;
  className?: string;
}

export const RealKingThroneScene: React.FC<RealKingThroneSceneProps> = ({
  step,
  kingName,
  className = 'w-full max-w-xl mx-auto',
}) => {
  const isSeated = step === 'seated';

  return (
    <div className={`relative ${className} select-none`}>
      <svg
        viewBox="0 0 500 430"
        className="w-full h-auto drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Shading */}
          <linearGradient id="royalGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF4B8" />
            <stop offset="25%" stopColor="#FFD700" />
            <stop offset="60%" stopColor="#B58A42" />
            <stop offset="100%" stopColor="#78551E" />
          </linearGradient>

          <linearGradient id="brightGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF9D2" />
            <stop offset="50%" stopColor="#FFDE59" />
            <stop offset="100%" stopColor="#C99427" />
          </linearGradient>

          {/* Crimson Velvet */}
          <linearGradient id="crimsonVelvet" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E63946" />
            <stop offset="40%" stopColor="#B94738" />
            <stop offset="100%" stopColor="#5E140B" />
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

          {/* Halo Glow */}
          <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FF9500" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF9500" stopOpacity="0" />
          </radialGradient>

          {/* Drop Shadows */}
          <filter id="sceneShadow" x="-10%" y="-10%" width="120%" height="125%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#211710" floodOpacity="0.5" />
          </filter>

          <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================= BACKGROUND ARCHITECTURE ================= */}
        {/* Palace Wall Arch Backdrop */}
        <path
          d="M60 420 L60 120 Q250 20 440 120 L440 420 Z"
          fill="#F5EBDD"
          stroke="#D8C3A5"
          strokeWidth="3"
        />

        {/* Inner Arch Accent */}
        <path
          d="M90 420 L90 140 Q250 50 410 140 L410 420 Z"
          fill="#FFF8EF"
          stroke="#BFA886"
          strokeWidth="2"
        />

        {/* Royal Sun Rays behind Throne */}
        {isSeated && (
          <g opacity="0.45" filter="url(#glowFilter)">
            <circle cx="250" cy="180" r="130" fill="url(#auraGlow)" />
            <line x1="250" y1="50" x2="250" y2="20" stroke="#FFD700" strokeWidth="3" strokeDasharray="6 4" />
            <line x1="160" y1="90" x2="130" y2="70" stroke="#FFD700" strokeWidth="3" strokeDasharray="6 4" />
            <line x1="340" y1="90" x2="370" y2="70" stroke="#FFD700" strokeWidth="3" strokeDasharray="6 4" />
            <line x1="120" y1="180" x2="90" y2="180" stroke="#FFD700" strokeWidth="3" strokeDasharray="6 4" />
            <line x1="380" y1="180" x2="410" y2="180" stroke="#FFD700" strokeWidth="3" strokeDasharray="6 4" />
          </g>
        )}

        {/* Palace Velvet Drapes Left & Right */}
        <path
          d="M60 100 Q110 110 100 240 Q70 190 60 100 Z"
          fill="url(#crimsonVelvet)"
          stroke="#B58A42"
          strokeWidth="2"
        />
        <path
          d="M440 100 Q390 110 400 240 Q430 190 440 100 Z"
          fill="url(#crimsonVelvet)"
          stroke="#B58A42"
          strokeWidth="2"
        />
        {/* Golden Curtain Tassels */}
        <circle cx="95" cy="200" r="5" fill="url(#royalGold)" />
        <line x1="95" y1="200" x2="95" y2="225" stroke="#FFD700" strokeWidth="2.5" />
        <circle cx="405" cy="200" r="5" fill="url(#royalGold)" />
        <line x1="405" y1="200" x2="405" y2="225" stroke="#FFD700" strokeWidth="2.5" />

        {/* ================= TORCH PILLARS ================= */}
        {/* Left Torch */}
        <g>
          <rect x="68" y="240" width="14" height="150" fill="url(#royalGold)" stroke="#78551E" strokeWidth="1.5" rx="3" />
          <polygon points="62,240 88,240 82,225 68,225" fill="url(#royalGold)" stroke="#FFE89E" />
          {/* Flame */}
          <path d="M75 200 Q83 215 75 225 Q67 215 75 200 Z" fill="url(#flameGrad)" className="animate-pulse" />
          <circle cx="75" cy="220" r="18" fill="url(#auraGlow)" opacity="0.6" />
        </g>

        {/* Right Torch */}
        <g>
          <rect x="418" y="240" width="14" height="150" fill="url(#royalGold)" stroke="#78551E" strokeWidth="1.5" rx="3" />
          <polygon points="412,240 438,240 432,225 418,225" fill="url(#royalGold)" stroke="#FFE89E" />
          {/* Flame */}
          <path d="M425 200 Q433 215 425 225 Q417 215 425 200 Z" fill="url(#flameGrad)" className="animate-pulse" />
          <circle cx="425" cy="220" r="18" fill="url(#auraGlow)" opacity="0.6" />
        </g>

        {/* ================= PODIUM & RED CARPET ================= */}
        {/* Step 1 (Bottom Dais) */}
        <polygon points="70,415 430,415 410,385 90,385" fill="#D8C3A5" stroke="#B58A42" strokeWidth="2" />
        {/* Step 2 (Middle Dais) */}
        <polygon points="105,385 395,385 380,360 120,360" fill="#BFA886" stroke="#8C682A" strokeWidth="2" />
        {/* Step 3 (Top Dais) */}
        <polygon points="135,360 365,360 350,335 150,335" fill="#D8C3A5" stroke="#B58A42" strokeWidth="2" />

        {/* Royal Red Carpet running down the center */}
        <polygon points="190,335 310,335 340,430 160,430" fill="url(#redCarpet)" stroke="#FFD700" strokeWidth="3" />
        {/* Gold Carpet Border Inset */}
        <line x1="198" y1="337" x2="170" y2="425" stroke="#FFE89E" strokeWidth="2" strokeDasharray="8 5" />
        <line x1="302" y1="337" x2="330" y2="425" stroke="#FFE89E" strokeWidth="2" strokeDasharray="8 5" />

        {/* ================= THE GRAND GOLDEN THRONE ================= */}
        <g filter="url(#sceneShadow)">
          {/* Throne Outer High Backrest (Arch with golden finials) */}
          <path
            d="M175 320 L175 140 Q250 55 325 140 L325 320 Z"
            fill="url(#royalGold)"
            stroke="#FFF4B8"
            strokeWidth="3.5"
          />

          {/* Royal Sun/Crown Crest Peak of Throne */}
          <polygon points="250,50 238,80 262,80" fill="url(#royalGold)" stroke="#FFF4B8" strokeWidth="2" />
          <circle cx="250" cy="68" r="6" fill="#B94738" stroke="#FFD700" strokeWidth="1.5" />
          <circle cx="230" cy="95" r="5" fill="#2A9D8F" />
          <circle cx="270" cy="95" r="5" fill="#2A9D8F" />

          {/* Velvet Tufted Inner Backrest */}
          <path
            d="M192 300 L192 150 Q250 85 308 150 L308 300 Z"
            fill="url(#crimsonVelvet)"
            stroke="#B58A42"
            strokeWidth="2"
          />

          {/* Tufted Golden Buttons */}
          <circle cx="250" cy="130" r="3.5" fill="#FFD700" />
          <circle cx="225" cy="160" r="3.5" fill="#FFD700" />
          <circle cx="275" cy="160" r="3.5" fill="#FFD700" />
          <circle cx="250" cy="190" r="3.5" fill="#FFD700" />
          <circle cx="225" cy="220" r="3.5" fill="#FFD700" />
          <circle cx="275" cy="220" r="3.5" fill="#FFD700" />

          {/* Throne Thick Velvet Seat Cushion */}
          <rect x="165" y="275" width="170" height="38" rx="10" fill="url(#crimsonVelvet)" stroke="#B58A42" strokeWidth="2.5" />

          {/* Golden Lion-Carved Armrests */}
          {/* Left Armrest */}
          <path d="M152 235 C152 220 178 220 178 245 L178 295 L152 295 Z" fill="url(#royalGold)" stroke="#FFF4B8" strokeWidth="2" />
          <circle cx="165" cy="230" r="10" fill="url(#royalGold)" stroke="#FFE89E" strokeWidth="2" />
          <circle cx="162" cy="228" r="2" fill="#352820" /> {/* Lion eye */}

          {/* Right Armrest */}
          <path d="M322 245 C322 220 348 220 348 235 L348 295 L322 295 Z" fill="url(#royalGold)" stroke="#FFF4B8" strokeWidth="2" />
          <circle cx="335" cy="230" r="10" fill="url(#royalGold)" stroke="#FFE89E" strokeWidth="2" />
          <circle cx="338" cy="228" r="2" fill="#352820" /> {/* Lion eye */}

          {/* Throne Sturdy Legs */}
          <rect x="168" y="310" width="18" height="25" rx="3" fill="url(#royalGold)" stroke="#78551E" strokeWidth="2" />
          <rect x="314" y="310" width="18" height="25" rx="3" fill="url(#royalGold)" stroke="#78551E" strokeWidth="2" />
        </g>

        {/* ================= THE REAL KING (ராஜா) ================= */}
        {isSeated ? (
          /* ============= STATE A: KING SEATED MAJESTICALLY ON THE THRONE ============= */
          <g filter="url(#sceneShadow)" className="transition-all duration-1000 transform">
            {/* 1. Grand Royal Cape Spreading over Throne and Dais */}
            <path
              d="M195 210 Q140 270 145 345 Q250 360 355 345 Q360 270 305 210 Z"
              fill="url(#crimsonVelvet)"
              stroke="#B58A42"
              strokeWidth="2.5"
            />
            {/* White Ermine Fur Trim with Black Accents */}
            <path
              d="M145 345 Q250 360 355 345 L352 335 Q250 350 148 335 Z"
              fill="#FFF8EF"
              stroke="#D8C3A5"
              strokeWidth="1.5"
            />
            <circle cx="170" cy="342" r="2" fill="#211710" />
            <circle cx="210" cy="348" r="2" fill="#211710" />
            <circle cx="250" cy="350" r="2" fill="#211710" />
            <circle cx="290" cy="348" r="2" fill="#211710" />
            <circle cx="330" cy="342" r="2" fill="#211710" />

            {/* 2. Royal Robed Legs / Silk Dhoti / Sherwani */}
            <path
              d="M200 270 L200 325 Q250 335 300 325 L300 270 Z"
              fill="url(#silkIvory)"
              stroke="#B58A42"
              strokeWidth="2"
            />
            {/* Golden Mojari Footwear on Footstool */}
            <ellipse cx="225" cy="328" rx="14" ry="7" fill="url(#royalGold)" stroke="#78551E" strokeWidth="1.5" />
            <ellipse cx="275" cy="328" rx="14" ry="7" fill="url(#royalGold)" stroke="#78551E" strokeWidth="1.5" />

            {/* 3. Royal Torso & Silk Attire */}
            <path
              d="M210 205 Q250 210 290 205 L295 275 Q250 282 205 275 Z"
              fill="url(#silkIvory)"
              stroke="#B58A42"
              strokeWidth="2"
            />

            {/* Golden Waistband / Kamarband */}
            <rect x="210" y="258" width="80" height="12" rx="4" fill="url(#royalGold)" stroke="#78551E" strokeWidth="1.5" />
            <circle cx="250" cy="264" r="5" fill="#E63946" stroke="#FFD700" strokeWidth="1" />

            {/* Multi-layered Royal Necklaces (நவரத்தின மாலை) */}
            <path d="M224 212 Q250 235 276 212" stroke="#FFD700" strokeWidth="3" fill="none" />
            <path d="M220 220 Q250 250 280 220" stroke="#FFD700" strokeWidth="3.5" fill="none" />
            <circle cx="250" cy="235" r="4" fill="#2A9D8F" />
            <circle cx="250" cy="250" r="5" fill="#B94738" stroke="#FFD700" strokeWidth="1" />

            {/* 4. Left Arm & Hand Resting on Throne Armrest */}
            <path d="M212 210 L170 235 L165 245" stroke="url(#silkIvory)" strokeWidth="16" strokeLinecap="round" />
            <circle cx="165" cy="232" r="7" fill="#E8C39E" stroke="#352820" strokeWidth="1" /> {/* Hand */}
            {/* Gold Kada (bracelet) */}
            <circle cx="172" cy="233" r="5" fill="url(#royalGold)" />

            {/* 5. Right Arm Holding the Sovereign Sengol (Scepter) */}
            <path d="M288 210 L325 235 L330 245" stroke="url(#silkIvory)" strokeWidth="16" strokeLinecap="round" />
            <circle cx="330" cy="235" r="7" fill="#E8C39E" stroke="#352820" strokeWidth="1" /> {/* Hand */}
            <circle cx="323" cy="234" r="5" fill="url(#royalGold)" />

            {/* The Sovereign Sengol (அரச செங்கோல்) */}
            <g filter="url(#glowFilter)">
              {/* Scepter Shaft */}
              <line x1="334" y1="140" x2="334" y2="295" stroke="url(#brightGold)" strokeWidth="5" strokeLinecap="round" />
              {/* Scepter Ornate Head */}
              <circle cx="334" cy="140" r="10" fill="url(#royalGold)" stroke="#FFF4B8" strokeWidth="2" />
              <polygon points="334,118 326,134 342,134" fill="url(#brightGold)" stroke="#FFF4B8" />
              <circle cx="334" cy="138" r="4.5" fill="#E63946" className="animate-pulse" /> {/* Glowing Ruby on Scepter */}
            </g>

            {/* 6. Royal Neck & Regal Face */}
            <rect x="242" y="190" width="16" height="18" fill="#E8C39E" stroke="#352820" strokeWidth="1" />
            {/* Face Oval */}
            <ellipse cx="250" cy="180" rx="19" ry="21" fill="#E8C39E" stroke="#352820" strokeWidth="1.5" />

            {/* Royal Ears & Kundalam Earrings */}
            <ellipse cx="230" cy="182" rx="4" ry="6" fill="#E8C39E" />
            <circle cx="230" cy="187" r="3" fill="#FFD700" />
            <ellipse cx="270" cy="182" rx="4" ry="6" fill="#E8C39E" />
            <circle cx="270" cy="187" r="3" fill="#FFD700" />

            {/* Eyes, Sovereign Eyebrows & Regal Mustache */}
            {/* Eyebrows */}
            <path d="M238 174 Q244 171 247 174" stroke="#211710" strokeWidth="2" strokeLinecap="round" />
            <path d="M253 174 Q256 171 262 174" stroke="#211710" strokeWidth="2" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="243" cy="178" r="2" fill="#211710" />
            <circle cx="257" cy="178" r="2" fill="#211710" />
            {/* Royal Tilak / Chandan on Forehead */}
            <line x1="250" y1="165" x2="250" y2="173" stroke="#B94738" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="250" cy="173" r="1.5" fill="#FFD700" />
            {/* Regal Curled Mustache (ராஜ மீசை) */}
            <path
              d="M242 191 Q250 187 258 191 Q265 186 264 193 Q250 195 250 191 Q250 195 236 193 Q235 186 242 191 Z"
              fill="#211710"
            />
            {/* Noble Smile */}
            <path d="M246 194 Q250 197 254 194" stroke="#78551E" strokeWidth="1.5" strokeLinecap="round" />

            {/* 7. The Magnificent Sovereign Golden Crown (ராஜ கிரீடம்) */}
            <g filter="url(#glowFilter)">
              {/* Crown Base Band */}
              <rect x="231" y="156" width="38" height="10" rx="3" fill="url(#brightGold)" stroke="#FFF4B8" strokeWidth="1.5" />
              {/* Crown Jewels on Band */}
              <circle cx="236" cy="161" r="2.5" fill="#E63946" />
              <circle cx="250" cy="161" r="3" fill="#2A9D8F" />
              <circle cx="264" cy="161" r="2.5" fill="#E63946" />

              {/* Crown Royal Peaks (5 majestic spires) */}
              <path
                d="M231 156 L233 138 L240 148 L250 120 L260 148 L267 138 L269 156 Z"
                fill="url(#brightGold)"
                stroke="#FFF4B8"
                strokeWidth="2"
              />
              {/* Jewels on Spires */}
              <circle cx="250" cy="120" r="4.5" fill="#E63946" stroke="#FFD700" strokeWidth="1" />
              <circle cx="233" cy="138" r="3" fill="#FFD700" />
              <circle cx="267" cy="138" r="3" fill="#FFD700" />
            </g>

            {/* Sparkle Glints on the Crown */}
            <polygon points="250,110 252,118 260,120 252,122 250,130 248,122 240,120 248,118" fill="#FFFFFF" className="animate-spin" />
          </g>
        ) : (
          /* ============= STATE B: KING APPROACHING UP THE RED CARPET ============= */
          <g className="animate-throne-walk" filter="url(#sceneShadow)">
            {/* Shadow beneath walking King */}
            <ellipse cx="250" cy="405" rx="35" ry="10" fill="#211710" opacity="0.45" />

            {/* Flowing Red Cape billowing behind walking King */}
            <path
              d="M225 280 Q195 340 205 395 Q250 385 295 395 Q305 340 275 280 Z"
              fill="url(#crimsonVelvet)"
              stroke="#B58A42"
              strokeWidth="2"
            />
            {/* White Ermine Trim */}
            <path d="M205 395 Q250 385 295 395 L292 387 Q250 379 208 387 Z" fill="#FFF8EF" />

            {/* Walking Royal Robe / Sherwani */}
            <path
              d="M226 280 Q250 285 274 280 L280 375 Q250 382 220 375 Z"
              fill="url(#silkIvory)"
              stroke="#B58A42"
              strokeWidth="2"
            />

            {/* Golden Sash */}
            <rect x="228" y="325" width="44" height="9" rx="3" fill="url(#royalGold)" />

            {/* Striding Royal Mojari Feet */}
            <ellipse cx="236" cy="385" rx="10" ry="6" fill="url(#royalGold)" />
            <ellipse cx="264" cy="378" rx="10" ry="6" fill="url(#royalGold)" />

            {/* Torso & Necklaces */}
            <path d="M234 285 Q250 298 266 285" stroke="#FFD700" strokeWidth="2.5" fill="none" />
            <circle cx="250" cy="293" r="3" fill="#E63946" />

            {/* Right Hand carrying Sengol upright */}
            <line x1="288" y1="240" x2="288" y2="360" stroke="url(#brightGold)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="288" cy="240" r="7" fill="url(#royalGold)" />
            <circle cx="288" cy="238" r="3" fill="#E63946" />

            {/* Neck & Face */}
            <ellipse cx="250" cy="255" rx="15" ry="17" fill="#E8C39E" stroke="#352820" strokeWidth="1.2" />
            {/* Mustache */}
            <path d="M244 263 Q250 260 256 263" stroke="#211710" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="245" cy="253" r="1.5" fill="#211710" />
            <circle cx="255" cy="253" r="1.5" fill="#211710" />

            {/* Crown while walking */}
            <rect x="235" y="236" width="30" height="7" rx="2" fill="url(#brightGold)" />
            <polygon points="235,236 238,222 244,230 250,210 256,230 262,222 265,236" fill="url(#brightGold)" stroke="#FFF4B8" />
            <circle cx="250" cy="210" r="3" fill="#E63946" />
          </g>
        )}

        {/* ================= CORONATION PETALS & GOLD COIN SHOWER ================= */}
        {isSeated && (
          <g opacity="0.85">
            {/* Rose Petals Falling */}
            <circle cx="120" cy="140" r="5" fill="#E63946" className="animate-bounce" />
            <circle cx="180" cy="80" r="4" fill="#FF7F6A" />
            <circle cx="310" cy="95" r="5" fill="#E63946" />
            <circle cx="370" cy="130" r="4" fill="#FF7F6A" className="animate-bounce" />
            <circle cx="140" cy="240" r="5" fill="#E63946" />
            <circle cx="360" cy="250" r="4" fill="#FF7F6A" />
            <circle cx="210" cy="370" r="4.5" fill="#E63946" />
            <circle cx="290" cy="370" r="4.5" fill="#FF7F6A" />

            {/* Golden Coins Falling */}
            <circle cx="160" cy="110" r="4" fill="#FFD700" stroke="#B58A42" />
            <circle cx="340" cy="120" r="4" fill="#FFD700" stroke="#B58A42" />
            <circle cx="130" cy="300" r="3.5" fill="#FFD700" stroke="#B58A42" />
            <circle cx="370" cy="310" r="3.5" fill="#FFD700" stroke="#B58A42" />
          </g>
        )}
      </svg>
    </div>
  );
};
