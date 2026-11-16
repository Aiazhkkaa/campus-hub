import { Component } from '@angular/core';

/**
 * Animated illustration for the landing page: a cute pastel campus with
 * bouncing students. Pure SVG + CSS animations (see "Campus scene" in styles.scss),
 * so it stays sharp on any screen and weighs almost nothing.
 */
@Component({
  selector: 'app-campus-scene',
  template: `
    <svg class="scene" viewBox="0 0 420 380" aria-hidden="true">
      <defs>
        <linearGradient id="scene-sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ede6ff" />
          <stop offset="1" stop-color="#ffe3f0" />
        </linearGradient>
        <linearGradient id="scene-hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#d9f5e8" />
          <stop offset="1" stop-color="#c3ecd7" />
        </linearGradient>
        <clipPath id="scene-round"><circle cx="210" cy="190" r="178" /></clipPath>
      </defs>

      <g clip-path="url(#scene-round)">
        <rect width="420" height="380" fill="url(#scene-sky)" />

        <!-- sun -->
        <g class="sun-rays">
          <circle cx="335" cy="78" r="38" fill="none" stroke="#fde68a" stroke-width="4" stroke-dasharray="6 12" stroke-linecap="round" />
        </g>
        <circle class="sun" cx="335" cy="78" r="22" fill="#fff3c4" stroke="#fde68a" stroke-width="3" />

        <!-- clouds -->
        <g class="cloud c1">
          <ellipse cx="95" cy="80" rx="34" ry="14" fill="#fff" />
          <ellipse cx="80" cy="72" rx="16" ry="13" fill="#fff" />
          <ellipse cx="104" cy="68" rx="20" ry="16" fill="#fff" />
        </g>
        <g class="cloud c2">
          <ellipse cx="250" cy="52" rx="26" ry="10" fill="#fff" opacity="0.9" />
          <ellipse cx="258" cy="45" rx="15" ry="12" fill="#fff" opacity="0.9" />
        </g>

        <!-- sparkles -->
        <text class="twinkle t1" x="58" y="150" font-size="16">✨</text>
        <text class="twinkle t2" x="350" y="160" font-size="13">✨</text>
        <text class="twinkle t3" x="175" y="70" font-size="11">✨</text>

        <!-- hill -->
        <path d="M0 296 Q210 250 420 296 V380 H0 Z" fill="url(#scene-hill)" />

        <!-- trees -->
        <g class="tree">
          <rect x="76" y="262" width="8" height="34" rx="4" fill="#e9c6a8" />
          <circle cx="80" cy="250" r="24" fill="#bbf7d0" />
          <circle cx="68" cy="240" r="10" fill="#a7f3d0" />
        </g>
        <g class="tree tree-2">
          <rect x="336" y="264" width="8" height="32" rx="4" fill="#e9c6a8" />
          <circle cx="340" cy="252" r="21" fill="#bbf7d0" />
          <circle cx="351" cy="244" r="9" fill="#a7f3d0" />
        </g>

        <!-- university building -->
        <line x1="210" y1="122" x2="210" y2="86" stroke="#a78bfa" stroke-width="3" stroke-linecap="round" />
        <path class="flag" d="M211 88 L238 95 L211 103 Z" fill="#f9a8d4" />
        <rect x="135" y="172" width="150" height="118" rx="12" fill="#fff" stroke="#e6dcfb" stroke-width="3" />
        <path d="M126 178 L210 124 L294 178 Z" fill="#c4b5fd" stroke="#c4b5fd" stroke-width="8" stroke-linejoin="round" />
        <circle cx="210" cy="157" r="12" fill="#fff" />
        <line class="clock-hand" x1="210" y1="157" x2="210" y2="149" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" />
        <line x1="210" y1="157" x2="215" y2="157" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round" />

        <rect class="win w1" x="150" y="190" width="26" height="22" rx="6" />
        <rect class="win w2" x="197" y="190" width="26" height="22" rx="6" />
        <rect class="win w3" x="244" y="190" width="26" height="22" rx="6" />
        <rect class="win w4" x="150" y="225" width="26" height="22" rx="6" />
        <rect class="win w5" x="244" y="225" width="26" height="22" rx="6" />
        <path d="M195 290 V268 A15 15 0 0 1 225 268 V290 Z" fill="#fbcfe8" />
        <circle cx="219" cy="278" r="2" fill="#f472b6" />
        <rect x="183" y="287" width="54" height="7" rx="3.5" fill="#ede6ff" />

        <!-- floating hearts -->
        <text class="heart h1" x="120" y="300" font-size="14">💜</text>
        <text class="heart h2" x="290" y="300" font-size="12">💗</text>
        <text class="heart h3" x="205" y="250" font-size="11">💜</text>

        <!-- student 1: with a book -->
        <ellipse class="shadow" cx="112" cy="345" rx="18" ry="4" />
        <g transform="translate(112 320)">
          <g class="bob">
            <ellipse cx="0" cy="0" rx="23" ry="21" fill="#ffd6e2" />
            <ellipse class="eye" cx="-7" cy="-3" rx="2.6" ry="3.3" fill="#2e2a47" />
            <ellipse class="eye" cx="7" cy="-3" rx="2.6" ry="3.3" fill="#2e2a47" />
            <ellipse cx="-13" cy="5" rx="4.5" ry="2.6" fill="#fb7185" opacity="0.45" />
            <ellipse cx="13" cy="5" rx="4.5" ry="2.6" fill="#fb7185" opacity="0.45" />
            <path d="M-4 6 Q0 10 4 6" fill="none" stroke="#2e2a47" stroke-width="2" stroke-linecap="round" />
            <rect x="15" y="0" width="13" height="16" rx="2.5" fill="#93c5fd" transform="rotate(-12 21 8)" />
          </g>
        </g>

        <!-- student 2: graduation cap -->
        <ellipse class="shadow s-d2" cx="210" cy="352" rx="20" ry="4" />
        <g transform="translate(210 326)">
          <g class="bob d2">
            <ellipse cx="0" cy="0" rx="25" ry="22" fill="#ddd0ff" />
            <path d="M-17 -19 L0 -27 L17 -19 L0 -11 Z" fill="#2e2a47" />
            <path class="tassel" d="M13 -18 V-8" stroke="#fde68a" stroke-width="2.5" stroke-linecap="round" />
            <ellipse class="eye" cx="-8" cy="-2" rx="2.7" ry="3.4" fill="#2e2a47" />
            <ellipse class="eye" cx="8" cy="-2" rx="2.7" ry="3.4" fill="#2e2a47" />
            <ellipse cx="-14" cy="6" rx="4.5" ry="2.6" fill="#fb7185" opacity="0.45" />
            <ellipse cx="14" cy="6" rx="4.5" ry="2.6" fill="#fb7185" opacity="0.45" />
            <path d="M-5 6 Q0 12 5 6" fill="none" stroke="#2e2a47" stroke-width="2" stroke-linecap="round" />
          </g>
        </g>

        <!-- student 3: with a ball -->
        <ellipse class="shadow s-d3" cx="305" cy="345" rx="18" ry="4" />
        <g transform="translate(305 320)">
          <g class="bob d3">
            <ellipse cx="0" cy="0" rx="23" ry="21" fill="#ffe6d5" />
            <ellipse class="eye" cx="-7" cy="-3" rx="2.6" ry="3.3" fill="#2e2a47" />
            <ellipse class="eye" cx="7" cy="-3" rx="2.6" ry="3.3" fill="#2e2a47" />
            <ellipse cx="-13" cy="5" rx="4.5" ry="2.6" fill="#fb7185" opacity="0.45" />
            <ellipse cx="13" cy="5" rx="4.5" ry="2.6" fill="#fb7185" opacity="0.45" />
            <path d="M-4 6 Q0 10 4 6" fill="none" stroke="#2e2a47" stroke-width="2" stroke-linecap="round" />
          </g>
        </g>
        <g class="ball"><circle cx="338" cy="336" r="8" fill="#fde68a" stroke="#fbbf24" stroke-width="2" /></g>

        <!-- speech bubbles that pop up one after another -->
        <g class="pop p1">
          <rect x="88" y="252" width="44" height="34" rx="14" fill="#fff" />
          <path d="M104 285 L110 294 L116 285 Z" fill="#fff" />
          <text x="110" y="276" font-size="18" text-anchor="middle">📚</text>
        </g>
        <g class="pop p2">
          <rect x="188" y="252" width="44" height="34" rx="14" fill="#fff" />
          <path d="M204 285 L210 294 L216 285 Z" fill="#fff" />
          <text x="210" y="276" font-size="18" text-anchor="middle">🎉</text>
        </g>
        <g class="pop p3">
          <rect x="283" y="252" width="44" height="34" rx="14" fill="#fff" />
          <path d="M299 285 L305 294 L311 285 Z" fill="#fff" />
          <text x="305" y="276" font-size="18" text-anchor="middle">⚽</text>
        </g>
      </g>
    </svg>
  `,
})
export class CampusScene {}
