const { Router } = require('express');
const router = Router();
const vision = require('@google-cloud/vision');

const CREDENTIALS = JSON.parse(JSON.stringify({
    "type": "service_account",
    "project_id": "rich-howl-379813",
    "private_key_id": "70aa4dbf50723c678a96764699a917c7f10652a7",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCS5etFP4Q0Q+pZ\n523QAawg/a9+CnYyUjQ+njk8MdniUkOhiX2HhBvk3m12MzeVb5OWiOIpJ8peZtew\nTqTbr20fAO0BD3FeFeH383xZsGHY43tFwNGztLItvk412yDPalesEiCDl9UdwoiC\nErgn6uwoCTElGbiLFu4U0K6KQyw9DZz+tK/sCCqcGHwRbN/Ow1lBwIjBgacGVyOJ\nM1hKssWURvErvpBcRuhjIWNcyHW8yAmVJphNJdATdkOfEFJxd96ne59rSR7wyFHD\ngWJzIy21Za2JBqKKIRLZiKVFHjMVAVurdtZumnU5AgziTK8qGDrTp0LCI1ez9mO9\n6rzu1AmzAgMBAAECggEAAMS/JsXheKhVUW/DNZ/xKIn9zjRUbMStTtpc1+abNqnm\ndMGXgRF4TjYSdxRz0IzEHRfEGG3REyRNMbHYoCsYA1e/HpOY1dxAznZQev0ghbpt\nOS+Yr5dgJFtF5tZBbsNiRdGQCk5uxKx2HHiY+KV7BkAUYc4P3ekj8vJGlCN4BxQo\nDNI/rlh/tDu1F2FZqqfxm7n8ELqgWyEJBg7dM5tW9u/NGwEGePs0+D1Sx4wzY7Wb\nabVdeuet61/nLT81XRtwiOAIiD4dZrfrU7YtOsbRpGS1uGWiEJOuAHgVdQv1fkjg\n5Ne8a6Vt5fn7xtgK2TeFQBHv1gRTlY/ykzoUgcr78QKBgQDIMKAtgY+xvYNH/Dix\n43+jW8eLDOXDfxLsu3EgwN0xqnSgDjSOf1jR4TLoNKUxeuq6KySI9nsfAE4aAvo6\nasmlduw7YgcgqGvYk6X0mnUU0j36zO6ltJYin6LXD0WXzBdveRf+9QgAH+OnhNcK\ndNuzaZwsY93bYWSWaUyDDxzy+QKBgQC72eeFcnT81bsfNpnsyGih5Lpdj5v5Clyg\nyEsieZXKG/JOpvof2iVdktkn46W+DUMlnc0quZ5JcCW7cvJFJBWECC2EvKWKsuOk\nnCzDSpnRucqBp37xwStJ5PVMzKOnaIwl2VG0JO2148XJhe5F7GxS2Qyay4Htna7W\nFgeuLL+hCwKBgAVNhHCwJeZHZtrZS4cqx47EN5zvUobDLvUmYfDEKxfNtBkpRysf\nJHMqy/ZqrpWI8/7KdcVLAifoEimOOqKhgYXoiIlqJ1YuH+00vAimrsNGbm3eT9QD\n3JY+NEoOFYHX3icNxhzy0KtwLM+bLTcRsWAnRAPJAW92PPve/i/ajqHBAoGAc2A2\nruPJrrCnKVij2aaNfUG6pVRa++69TZM3coky0tuvS1eLMJ0PbhWPgsxzM/N5VlVB\neghfi8NxqVvEKWssO9e5/VjQZAvTfXrek2PybbmrA08YzOtT5yLU9sKJkXzI90Yu\nxHIZ/ilThZ7Y5eF79raQ41IzDvpWM+978CJT4FkCgYBGEDVbfaIH3Wimx/xy4khh\nHDIb+pJ8cgD1DvoiXmp65Ob1j7/HtP45YMiISoP5r5yhQksNriJEXc6E3b3ZWeB2\n8QYkfSJAtDrxCBD05N3YwtpY6oFj6dl1/ueR/o0Cvst4DjJbsK9vtAc013VHYys2\nA2JCHFH0JezMlJ2enw3IAQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "visio-445@rich-howl-379813.iam.gserviceaccount.com",
    "client_id": "109535144642653371753",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/visio-445%40rich-howl-379813.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}));

const CONFIG = {
    credentials: {
        private_key: CREDENTIALS.private_key,
        client_email: CREDENTIALS.client_email
    }
};

const client = new vision.ImageAnnotatorClient(CONFIG);


router.post('/google', function (req, res) {
    console.log(req.body.src);
    const imgpath = `public\\driveLicense\\${req.body.src}`
    client
        // .textDetection('../public/driveLicense/c420165b-8a2b-4f09-a53c-60672e6266d9_.jpg')
        // .textDetection('public\\driveLicense\\c420165b-8a2b-4f09-a53c-60672e6266d9_.jpg')
        .textDetection(imgpath)
        // .textDetection(`gs://bucket-test1245/${req.body.src}`)
        .then(results => {
            const [result] = results
            // console.log(result);
            const detections = result.fullTextAnnotation.text.split('\n')[15].slice(15);
            console.log(detections);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });

});

module.exports = router;