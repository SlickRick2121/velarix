const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="text-center">
          <p className="text-2xl font-bold mb-2 tracking-tight">Velarix<span className="text-accent">.</span></p>
          <p className="text-sm text-muted-foreground font-light">&copy; {new Date().getFullYear()} Velarix Digital Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
