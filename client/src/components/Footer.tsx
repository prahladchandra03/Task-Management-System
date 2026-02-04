export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 text-center mt-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} Task Manager. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
