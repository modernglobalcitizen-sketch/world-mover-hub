-- Create a table for fund transactions (ledger)
CREATE TABLE public.fund_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
  recipient_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public read, admin write)
ALTER TABLE public.fund_transactions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read transactions (transparency)
CREATE POLICY "Anyone can view fund transactions"
ON public.fund_transactions
FOR SELECT
USING (true);

-- Create index for faster date-based queries
CREATE INDEX idx_fund_transactions_date ON public.fund_transactions(date DESC);