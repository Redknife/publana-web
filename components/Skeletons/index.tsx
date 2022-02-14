import React from 'react';
import { UnreachableCaseError } from 'ts-essentials';

type PubSkeletonProps = {
  variant: 'small' | 'page';
  animate?: boolean;
};
export const PubSkeleton = ({ variant, animate = true }: PubSkeletonProps) => {
  switch (variant) {
    case 'small':
      return (
        <div
          className={`
            w-full flex items-center space-x-4 p-6
            bg-white dark:bg-gray-800
            border-4 border-white dark:border-gray-800
            rounded-xl shadow-lg
          `}
        >
          <div
            className={`${animate && 'animate-pulse'} flex space-x-4 w-full`}
          >
            <div className="flex-1 space-y-3 py-1">
              <div className="grid grid-cols-4 gap-4">
                <div className="h-2 bg-gray-200 rounded col-span-1" />
                <div className="h-2 bg-gray-200 rounded col-span-1" />
                <div className="h-2 bg-gray-200 rounded col-span-2" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-gray-200 rounded col-span-1" />
                <div className="h-2 bg-gray-200 rounded col-span-2" />
              </div>
              <div className="h-2 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      );
    case 'page':
      return (
        <div
          className={`
            w-full flex flex-1 space-x-4 p-6
            bg-white dark:bg-gray-800
            border-4 border-white dark:border-gray-800
            rounded-xl shadow-lg
          `}
        >
          <div className="flex flex-col overflow-hidden max-w-full w-full">
            <div className={`${animate && 'animate-pulse'} flex space-x-4`}>
              <div className="flex-1 space-y-6 py-1">
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-1" />
                    <div className="h-2 bg-gray-200 rounded col-span-1" />
                    <div className="h-2 bg-gray-200 rounded col-span-2" />
                  </div>
                  <div className="h-2 bg-gray-200 rounded" />
                </div>
                <div className="h-2 bg-gray-200 rounded" />
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-2" />
                    <div className="h-2 bg-gray-200 rounded col-span-1" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-1" />
                    <div className="h-2 bg-gray-200 rounded col-span-2" />
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      );
    default:
      throw new UnreachableCaseError(variant);
  }
};
