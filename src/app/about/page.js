import React from "react";

function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 px-4 py-10 h-[85vh]">
      <p className=" text-center max-w-3xl mb-4">
        Η εφαρμογή δημιουργήθηκε στο πλαίσιο προσωπικού project και αξιοποιεί
        δεδομένα που είναι διαθέσιμα δημόσια από επίσημους κυβερνητικούς φορείς.
        Στόχος της είναι η παρουσίαση αυτών των δεδομένων με φιλικό και
        κατανοητό τρόπο προς το κοινό.
      </p>
      <p className=" text-center max-w-3xl mb-4 italic">
        Βρίσκεται σε πειραματικό στάδιο και ενδέχεται να περιέχει σφάλματα ή
        ανακρίβειες. Αν έχετε οποιαδήποτε απορία ή πρόταση, μπορείτε να
        επικοινωνήσετε μαζί μου μέσω{" "}
        <a
          href="mailto:johnpapani1@gmail.com"
          className="text-blue-500 underline"
        >
          αποστολής email
        </a>
        .
      </p>
    </div>
  );
}

export default AboutPage;
