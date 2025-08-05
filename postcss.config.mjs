const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {
      // Prefix optimization to reduce CSS size
      flexbox: 'no-2009',
      grid: 'autoplace',
    },
    // CSS compression optimization in production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
            normalizeWhitespace: true,
            colormin: true,
            minifyFontValues: true,
            minifySelectors: true,
            mergeLonghand: true,
            mergeRules: true,
            reduceIdents: false, // Avoid conflicts with animations
            zindex: false, // Avoid z-index issues
          },
        ],
      },
    }),
  },
};

export default config;
