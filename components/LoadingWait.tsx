import Image from "next/image";
interface LoadingWaitProps {
  isLoading: boolean;
  error?: string | null;
}

export const LoadingWait: React.FC<LoadingWaitProps> = ({
  isLoading,
  error,
}) => {
  if (isLoading)
    return (
      <div className="flex min-h-6 items-center justify-center" role="status" aria-label="Ачаалж байна">
        <Image
          src="/icons/loading.svg"
          alt=""
          width={24}
          height={24}
          className="animate-spin"
        />
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  return null;
};
