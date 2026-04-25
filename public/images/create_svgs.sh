#!/bin/bash

create_svg() {
  local filename=$1
  local name=$2
  local color=$3
  local emoji=$4
  cat > "/home/user/new-wesbite-/public/images/${filename}" << SVG
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.05"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#bg)" rx="16"/>
  <rect x="30" y="50" width="140" height="90" rx="12" fill="${color}" opacity="0.9"/>
  <rect x="30" y="50" width="140" height="38" rx="12" fill="${color}"/>
  <rect x="30" y="74" width="140" height="16" fill="${color}"/>
  <text x="100" y="78" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold" font-size="13">${name}</text>
  <rect x="50" y="100" width="100" height="28" rx="6" fill="white" opacity="0.85"/>
  <text x="100" y="119" text-anchor="middle" fill="${color}" font-family="Arial" font-size="11" font-weight="600">TABLET</text>
  <text x="100" y="158" text-anchor="middle" font-size="28">${emoji}</text>
</svg>
SVG
}

create_svg "dolo650.png" "DOLO 650" "#1a6b3c" "💊"
create_svg "crocin.png" "CROCIN" "#2563eb" "💊"
create_svg "azithral.png" "AZITHRAL" "#7c3aed" "🧬"
create_svg "allegra.png" "ALLEGRA" "#0891b2" "🌿"
create_svg "pantop.png" "PANTOP 40" "#b45309" "💊"
create_svg "ecosprin.png" "ECOSPRIN" "#dc2626" "❤️"
create_svg "glycomet.png" "GLYCOMET" "#0d9488" "🩺"
create_svg "atorva.png" "ATORVA" "#9333ea" "❤️"
create_svg "cetirizine.png" "CETIRIZINE" "#16a34a" "🌿"
create_svg "omez.png" "OMEZ 20" "#ca8a04" "💊"

echo "All SVGs created."
