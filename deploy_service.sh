VERSION=$1
MONGO_URI=$2
JWT_SECRET=$3
RECAPTCHA_SECRET_KEY=$4

fandogh service apply -f fandogh-manifest.yml -p IMAGE_VERSION=$VERSION
