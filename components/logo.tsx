import Image from 'next/image';
import mascot from '@/assets/patchcaster.webp';

// The PatchCaster herald, the same artwork as the GitHub organisation avatar.
// Decorative wherever it sits next to the name, hence the empty alt text.
export function Mascot({ className, priority }: { className?: string; priority?: boolean }) {
  return <Image src={mascot} alt="" className={className} priority={priority} />;
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2 font-semibold tracking-tight">
      <Mascot className="size-7 rounded-md" priority />
      PatchCaster
    </span>
  );
}
