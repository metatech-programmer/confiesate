export default function Footer() {
  return (
    <footer className="text-center text-xs p-4 absolute bottom-0 w-full opacity-50 ">
      <p className="font-open-sans font-bold text-sm">
        &copy; {new Date().getFullYear()} Confiesate - Derechos
        reservados.
      </p>
    </footer>
  );
}
