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
import { UserAvatar } from "./user-avatar";

export function EnvironmentsTable() {
  return (
    <>
      <div>
        <Input placeholder="Search" className="w-[300px]" />
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Development-1</TableCell>
            <TableCell>
              <div className="focus:ring-ring text-foreground inline-flex items-center rounded-md border border-rose-700 bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2">
                Available
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button>Reserve</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Parallel-Production</TableCell>
            <TableCell>
              <div className="focus:ring-ring text-foreground inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2">
                Reserved
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button>Reserve</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Parallel-Production-1</TableCell>
            <TableCell>
              <div className="flex items-center">
                <UserAvatar name="John Snow"></UserAvatar>
                <div className="ml-2">Reserved by John Snow, 5 mins ago</div>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button>Reserve</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
