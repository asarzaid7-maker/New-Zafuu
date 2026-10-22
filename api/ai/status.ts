export default function handler(req: any, res: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '');

  res.status(200).json({
    status: 'online',
    assistantName: 'ZaFoot AI',
    model: 'gemini-3.8-flash',
    isConfigured,
  });
}
