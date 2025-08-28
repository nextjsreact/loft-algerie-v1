import { getInternetConnectionTypeById } from "@/app/actions/internet-connections";
import { InternetConnectionTypeForm } from "@/components/forms/internet-connection-type-form";
import { Heading } from "@/components/ui/heading";
import { notFound } from "next/navigation";

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function EditInternetConnectionTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Validate that the ID is a valid UUID
  if (!UUID_REGEX.test(id)) {
    notFound();
  }

  const { data: internetConnectionType, error } = await getInternetConnectionTypeById(id);

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!internetConnectionType) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="text-yellow-800 font-medium">Not Found</h3>
          <p className="text-yellow-600 mt-1">Internet connection type not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Heading
        title="Edit Internet Connection Type"
        description="Update the details of the internet connection type."
      />
      <div className="mt-6">
        <InternetConnectionTypeForm initialData={internetConnectionType} />
      </div>
    </div>
  );
}
