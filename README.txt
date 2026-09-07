VILA CHAT
Coloque index.html, style.css e script.js na raiz do GitHub Pages.
Firebase Authentication: Anonymous deve estar ativado.
Firestore: coleção messages.
Regras recomendadas:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read, create: if request.auth != null;
      allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }
  }
}