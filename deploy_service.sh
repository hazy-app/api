VERSION=$1
MONGO_URI=$2
JWT_SECRET=$3
RECAPTCHA_SECRET_KEY=$4
FIREBASE_SERVER_KEY=$5
RECAPTCHA_SKIP_VALUE=$6

echo "----------"
echo $VERSION
echo "----------"

fandogh service apply -f fandogh-manifest.yml -p IMAGE_VERSION=$VERSION -p MONGO_URI=$MONGO_URI -p JWT_SECRET=$JWT_SECRET -p RECAPTCHA_SECRET_KEY=$RECAPTCHA_SECRET_KEY -p FIREBASE_SERVER_KEY=$FIREBASE_SERVER_KEY -p RECAPTCHA_SKIP_VALUE=$RECAPTCHA_SKIP_VALUE
