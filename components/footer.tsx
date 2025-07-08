export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container flex h-14 items-center justify-center px-4 md:px-6">
        <p className="text-sm text-muted-foreground">
          Copyright © {currentYear} Vishwajeet Kondi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
