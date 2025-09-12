import Image from 'next/image';

export default function BrandLogo({
  collapse = false,
}: {
  collapse?: boolean;
}) {
  return (
    <Image
      src={'/assets/logo.png'}
      alt='Donutly Logo'
      width={100}
      height={100}
      className={`${collapse ? 'w-0 h-0' : 'w-auto h-auto'}`}
    />
  );
}
