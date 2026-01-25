import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  tag: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export function DashboardCard({ title, tag, description, icon, href }: DashboardCardProps) {
  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
            {icon}
          </div>
          <Badge variant="secondary">{tag}</Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white">
          <a href={href}>Try Now</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
