# Use official lightweight Python image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Prevent Python from writing bytecode (.pyc) and buffering logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend source code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Command to start FastAPI server bound to all network interfaces
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]