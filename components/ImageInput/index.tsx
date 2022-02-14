import React, {
  useState,
  useCallback,
  ComponentPropsWithRef,
  ChangeEventHandler,
} from 'react';
import { MdImage } from 'react-icons/md';
import * as HoverCard from '@radix-ui/react-hover-card';
import { styled, keyframes } from '@stitches/react';

import { Input } from 'components/Form';

type ImageInputProps = Omit<ComponentPropsWithRef<'input'>, 'type'>;

const slideDown = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideUp = keyframes({
  '0%': { opacity: 0, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const HoverCardContent = styled(HoverCard.Content, {
  '&[data-side="top"]': { animationName: slideUp },
  '&[data-side="bottom"]': { animationName: slideDown },
  animationDuration: '0.6s',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
});

export const ImageInput = (props: ImageInputProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>();
  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      props.onChange?.(e);
      const isValid = e.target.validity.valid;
      setPreviewUrl(isValid ? e.target.value : undefined);
    },
    [props],
  );

  return (
    <div className="relative">
      <Input
        type="url"
        placeholder="Image url"
        pattern="https?://.*"
        {...props}
        onChange={handleChange}
      />
      {previewUrl && (
        <span className="absolute text-2xl top-[50%] translate-y-[-50%] right-3">
          <HoverCard.Root openDelay={0} closeDelay={0}>
            <HoverCard.Trigger>
              <MdImage />
            </HoverCard.Trigger>
            <HoverCardContent side="top">
              <div className="w-[300px] p-0.5 bg-neutral-800 rounded-sm">
                <img
                  alt="preview"
                  src={previewUrl}
                  className="block max-w-full w-full"
                />
              </div>
            </HoverCardContent>
          </HoverCard.Root>
        </span>
      )}
    </div>
  );
};
