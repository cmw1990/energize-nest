import { RouteGuard } from "@/components/routing/RouteGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Profile() {
  return (
    <RouteGuard
      requirements={{
        permission: "authenticated",
        platform: ["webapp", "desktop", "mobile"],
      }}
    >
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Profile content will be implemented here */}
            <p>Profile page content coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  );
}
