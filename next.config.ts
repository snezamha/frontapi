import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'lh4.googleusercontent.com',
      'lh5.googleusercontent.com',
      'lh6.googleusercontent.com',
      'googleusercontent.com',
      'uploadthing.com',
      'utfs.io',
      'avatars.githubusercontent.com',
      'githubusercontent.com',
    ],
  },
};

export default withNextIntl(nextConfig);
