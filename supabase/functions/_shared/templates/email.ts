export const templateObject = [
  {
    type: "WELCOME_EMAIL",
    getSubject: () => "Welcome",
    getTemplate: ({ name }: { name: string }): string => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; background-color: #f9f9f9; padding: 20px; }
          .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .btn { background: #3ecf8e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Welcome, ${name}! 👋</h2>
          <p>Thanks for signing up.</p>
        </div>
      </body>
      </html>
      `,
  },
];
