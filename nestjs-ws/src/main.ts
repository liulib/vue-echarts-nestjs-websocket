import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new WsAdapter(app));
    app.enableCors();

    await app.listen(3000);

    console.log(`Application is running on: http://127.0.0.1:3000`);
}
bootstrap();
