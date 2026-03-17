import Image from 'next/image';
import { MapPin, Link as LinkIcon, Users } from 'lucide-react';
import type { ProfileUser } from '@/types/profile';
import { formatNumber } from '@/lib/utils';

interface ProfileHeaderProps {
  user: ProfileUser;
  profileUrl: string;
}

export function ProfileHeader({ user, profileUrl }: ProfileHeaderProps) {
  const joinYear = new Date(user.createdAt).getFullYear();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
      <Image
        src={user.avatarUrl}
        alt={`${user.login}'s avatar`}
        width={96}
        height={96}
        className="h-24 w-24 rounded-full ring-2 ring-gray-200 dark:ring-white/10"
        priority
      />
      <div className="flex-1 space-y-2">
        <div>
          {user.name && (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
          )}
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            @{user.login}
          </a>
        </div>

        {user.bio && (
          <p className="max-w-xl text-sm text-gray-600 dark:text-gray-300">{user.bio}</p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
          {user.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {user.location}
            </span>
          )}
          {user.blog && (
            <a
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition-colors hover:text-gray-900 dark:hover:text-white"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              {user.blog.replace(/^https?:\/\//, '')}
            </a>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span>
              <strong className="text-gray-700 dark:text-gray-300">
                {formatNumber(user.followers)}
              </strong>{' '}
              followers ·{' '}
              <strong className="text-gray-700 dark:text-gray-300">
                {formatNumber(user.following)}
              </strong>{' '}
              following
            </span>
          </span>
          <span className="text-gray-400 dark:text-gray-500">Member since {joinYear}</span>
        </div>
      </div>
    </div>
  );
}
