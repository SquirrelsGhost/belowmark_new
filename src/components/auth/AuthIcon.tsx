/** Auth-specific icons in the same 24×24 hairline style as ui/Icon. */
const AUTH_ICON_PATHS = {
  arrowLeft: "M20 12H5m6-6-6 6 6 6",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  eyeOff: "M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.9 8.4 2 12 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2",
  alert: "M12 8v5m0 3.5v.01M10.3 3.9 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  lock: "M6 11h12v10H6V11Zm2 0V7a4 4 0 1 1 8 0v4",
  check: "m4 12.5 5 5L20 6.5",
  mail: "M3 5h18v14H3V5Zm0 0 9 8 9-8",
} as const;

export type AuthIconName = keyof typeof AUTH_ICON_PATHS;

interface AuthIconProps {
  name: AuthIconName;
  className?: string;
}

export default function AuthIcon({ name, className = "size-5" }: AuthIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" className={className}>
      <path d={AUTH_ICON_PATHS[name]} />
    </svg>
  );
}
