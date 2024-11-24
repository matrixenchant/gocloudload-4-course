package utils

type Config struct {
	Address  string
	CSRFKey  string
	CertFile string
	KeyFile  string
}

func LoadConfig() Config {
	return Config{
		Address:  ":8443",
		CSRFKey:  "csrf_secret",
		CertFile: "./cert/cert.pem",
		KeyFile:  "./cert/key.pem",
	}
}
