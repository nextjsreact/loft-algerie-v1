import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="p-4">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Internet Connection Type Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The internet connection type you're looking for doesn't exist or may have been deleted.
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/settings/internet-connections">
              Back to Internet Connections
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/settings/internet-connections/new">
              Create New Connection Type
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}