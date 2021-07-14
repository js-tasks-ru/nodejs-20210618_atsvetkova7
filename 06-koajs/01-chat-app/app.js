const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribes = [];

router.get('/subscribe', async (ctx, next) => {
  await waitPublish(ctx);
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (message) {
    subscribes.forEach((sub) => {
      sub.ctx.body = message;
      sub.resolve();
    });

    ctx.body = message;
    return;
  }

  ctx.body = 'Message not found';
});

app.use(router.routes());

function waitPublish(ctx) {
  return new Promise((resolve) => {
    subscribes.push({
      ctx,
      resolve,
    });
  });
}

module.exports = app;
