# ---- 阶段1: 构建 ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# 先复制 pom.xml，利用 Docker 缓存加速依赖下载
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# 复制源码并打包（跳过测试）
COPY src/ src/
RUN mvn package -DskipTests -B

# ---- 阶段2: 运行 ----
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
