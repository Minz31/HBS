$path = "f:\Big_folder\HB\HBS\springboot_backend_jwt\src\main\java\com\hotel"
$files = Get-ChildItem -Path $path -Filter "*.java" -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content.Replace("package com.healthcare", "package com.hotel")
    $content = $content.Replace("import com.healthcare", "import com.hotel")
    Set-Content -Path $file.FullName -Value $content
}
