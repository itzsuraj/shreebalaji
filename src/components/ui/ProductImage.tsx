import Image, { ImageProps } from 'next/image';

interface ProductImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
}

export default function ProductImage({ src, alt, fill, ...props }: ProductImageProps) {
  const isSvg = src.endsWith('.svg');
  if (isSvg) {
    // For SVGs, use a regular <img> tag and omit 'fill'
    return <img src={src} alt={alt} {...props} style={{ width: '100%', height: '100%', objectFit: 'cover', ...props.style }} />;
  }
  // For other images, use Next.js <Image />
  return <Image src={src} alt={alt} fill={fill} {...props} />;
} 