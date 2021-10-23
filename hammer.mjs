export async function clean() {
    await folder('target').delete()
}

export async function start() {
    await shell('hammer run example/index.ts --dist target/start')
}

export async function build() {
    await shell(`tsc src/fastify-typebox --outDir target/build --declaration`)
    await folder('target/build').add('src/package.json')
    await folder('target/build').add('license')
    await folder('target/build').add('readme.md')
    await shell('cd target/build && npm pack')
}