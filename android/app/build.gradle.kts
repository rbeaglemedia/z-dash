plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

val repoRoot = rootProject.projectDir.parentFile
val adultFiles = listOf(
    "index.html",
    "sw.js",
    "manifest.webmanifest",
    "shared/version.js",
    "icons/zdash-192.png",
    "icons/zdash-512.png",
    "icons/zdash-apple-180.png",
    "icons/zdash-maskable-512.png",
)

val copyAdultAssets = tasks.register<Copy>("copyAdultAssets") {
    into(layout.buildDirectory.dir("generated/adultAssets/www"))
    adultFiles.forEach { rel ->
        val src = repoRoot.resolve(rel)
        if (!src.isFile) throw GradleException("Missing adult asset: $src")
        from(src) {
            into(rel.substringBeforeLast('/', ""))
        }
    }
    doLast {
        val out = layout.buildDirectory.dir("generated/adultAssets/www").get().asFile
        val banned = listOf("jr.html", "world.html", "adventure.html", "neon-paint.html")
        val found = out.walkTopDown().filter { it.isFile && banned.contains(it.name) }.toList()
        if (found.isNotEmpty()) throw GradleException("Kid file bundled: $found")
    }
}

android {
    namespace = "games.beagle.zdash.test"
    compileSdk = 34

    defaultConfig {
        applicationId = "games.beagle.zdash.test"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "lx-test-1"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    sourceSets.getByName("main").assets.srcDir(layout.buildDirectory.dir("generated/adultAssets"))
}

tasks.named("preBuild").configure { dependsOn(copyAdultAssets) }
tasks.matching { it.name.contains("merge") && it.name.contains("Assets") }.configureEach {
    dependsOn(copyAdultAssets)
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.webkit:webkit:1.11.0")
    testImplementation("junit:junit:4.13.2")
}
