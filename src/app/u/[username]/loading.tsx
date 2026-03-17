import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-8">
      <ProfileSkeleton />
    </div>
  );
}
