// This NODEENV function:
// Sets NODE_ENV = 'production'
export default function nodeEnv(done) {
    process.env.NODE_ENV = 'production';
    done();
}
