from fastapi import FastAPI

app = FastAPI(title="SignalDeck API")


@app.get("/")
def read_root():
    return {"message": "SignalDeck API is online"}
