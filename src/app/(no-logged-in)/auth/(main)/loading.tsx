import { Skeleton } from "@/components/ui/skeleton";

const LoadingAuth = () => {
  return (
    <main className="flex flex-1 items-center justify-center p-6 md:p-10">
      <Skeleton className="h-72 max-w-md rounded-lg" />
    </main>
  );
};

export default LoadingAuth;
