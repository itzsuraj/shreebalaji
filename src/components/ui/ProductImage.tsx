import Image, { ImageProps } from 'next/image';
import styles from './ProductImage.module.css';

interface ProductImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
}

export default function ProductImage({ src, alt, fill, ...props }: ProductImageProps) {
  const isSvg = src.endsWith('.svg');
  if (isSvg) {
    // For SVGs, use Next.js Image with width and height instead of fill
    return (
      <Image 
        src={src} 
        alt={alt} 
        width={400} 
        height={400} 
        {...props} 
        className={`${styles.svgImage} ${props.className || ''}`}
      />
    );
  }
  // For other images, use Next.js <Image />
  return <Image src={src} alt={alt} fill={fill} {...props} />;
} 