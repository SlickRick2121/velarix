const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-2">PlentifulPower Consulting</h3>
          <p className="text-primary-foreground/80 mb-6">
            Creative Technology Consulting • Netherlands & United States
          </p>
          
          <div className="border-t border-primary-foreground/20 pt-8 mt-8">
            <p className="text-sm text-primary-foreground/70">
              © {new Date().getFullYear()} PlentifulPower Consulting. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
