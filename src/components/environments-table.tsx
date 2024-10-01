import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { api } from "@/utils/api";
import { UserAvatar } from "./user-avatar";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function EnvironmentsTable() {
  const [search, setSearch] = useState("");

  const {
    data: environments,
    error,
    status,
  } = api.post.getEnvironments.useQuery();

  if (error) {
    return <span>Error: {error.message}</span>;
  }
  if (status === "pending") {
    return <span>Loading...</span>;
  }

  return (
    <>
      <div>
        <Input
          placeholder="Search"
          className="w-[300px]"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[121px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {environments
            .filter((env) => {
              if (!search) {
                return true;
              }
              return env.name
                .toLowerCase()
                .includes(search.trim().toLowerCase());
            })
            .map((env) => (
              <EnvironmentRow key={env.id} env={env} />
            ))}
        </TableBody>
      </Table>
    </>
  );
}

export type Environment = {
  id: number;
  name: string;
  slug: string;
  reservedBy: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
};

function EnvironmentRow({ env }: { env: Environment }) {
  const utils = api.useUtils();

  const reserve = api.post.reserve.useMutation({
    onSuccess: async () => {
      await utils.post.getEnvironments.invalidate();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to update",
        description: "Something went wrong...",
      });
    },
  });

  const release = api.post.release.useMutation({
    onSuccess: async () => {
      await utils.post.getEnvironments.invalidate();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to update",
        description: "Something went wrong...",
      });
    },
  });

  return (
    <TableRow>
      <TableCell className="font-medium">{env.name}</TableCell>
      {env.reservedBy ? (
        <>
          <TableCell>
            <div className="flex items-center">
              <UserAvatar
                name={env.reservedBy.name!}
                image={env.reservedBy.image!}
              />
              <div className="ml-2">Reserved by {env.reservedBy.name}</div>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Button
              className="w-full"
              onClick={() => release.mutate(env.id)}
              disabled={release.isPending}
            >
              {release.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Done"
              )}
            </Button>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell>Available</TableCell>
          <TableCell className="text-right">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => reserve.mutate(env.id)}
              disabled={reserve.isPending}
            >
              {reserve.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Reserve"
              )}
            </Button>
          </TableCell>
        </>
      )}
    </TableRow>
  );
}
