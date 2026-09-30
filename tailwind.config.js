/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          DEFAULT: '#F5EBDD',
          light: '#FAF4EB',
          dark: '#E8DCB8',
        },
        cream: {
          DEFAULT: '#FFF8EF',
          soft: '#FFFDF9',
        },
        coral: {
          reef: '#FF7F6A',
          deep: '#B94738',
          hover: '#A33C2F',
        },
        sand: {
          DEFAULT: '#D8C3A5',
          light: '#E6D7C3',
          dark: '#BFA886',
        },
        gold: {
          DEFAULT: '#B58A42',
          light: '#D4AA5D',
          dark: '#8C682A',
        },
        royal: {
          brown: '#352820',
          dark: '#211710',
          muted: '#635348',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        patrolLeft: {
          '0%, 100%': { transform: 'translateX(0px) scaleX(1)' },
          '48%': { transform: 'translateX(140px) scaleX(1)' },
          '50%': { transform: 'translateX(140px) scaleX(-1)' },
          '98%': { transform: 'translateX(0px) scaleX(-1)' },
        },
        patrolRight: {
          '0%, 100%': { transform: 'translateX(0px) scaleX(-1)' },
          '48%': { transform: 'translateX(-140px) scaleX(-1)' },
          '50%': { transform: 'translateX(-140px) scaleX(1)' },
          '98%': { transform: 'translateX(0px) scaleX(1)' },
        },
        gateOpenLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        gateOpenRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        royalPulse: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 15px rgba(181, 138, 66, 0.4)' },
          '50%': { transform: 'scale(1.03)', boxShadow: '0 0 30px rgba(181, 138, 66, 0.8)' },
        },
        gunshot: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '20%': { transform: 'scale(1.2)', opacity: '1' },
          '40%': { transform: 'scale(1)', opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        grenadeExplosion: {
          '0%': { transform: 'scale(0.2)', opacity: '0' },
          '25%': { transform: 'scale(1.3)', opacity: '1' },
          '50%': { transform: 'scale(1)', opacity: '0.9' },
          '85%': { opacity: '0.8' },
          '100%': { transform: 'scale(1.1)', opacity: '0' },
        },
        screenShake: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translate(-6px, -4px) rotate(-1deg)' },
          '20%, 40%, 60%, 80%': { transform: 'translate(6px, 4px) rotate(1deg)' },
        },
        throneWalk: {
          '0%': { transform: 'translateY(120px) scale(0.7)', opacity: '0' },
          '50%': { transform: 'translateY(30px) scale(0.9)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        }
      },
      animation: {
        'patrol-left': 'patrolLeft 8s ease-in-out infinite',
        'patrol-right': 'patrolRight 8s ease-in-out infinite',
        'gate-left': 'gateOpenLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'gate-right': 'gateOpenRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'royal-pulse': 'royalPulse 3s ease-in-out infinite',
        'gunshot': 'gunshot 4.5s ease-out forwards',
        'grenade': 'grenadeExplosion 4.5s ease-out forwards',
        'screen-shake': 'screenShake 0.6s ease-in-out',
        'throne-walk': 'throneWalk 4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
      }
    },
  },
  plugins: [],
}
