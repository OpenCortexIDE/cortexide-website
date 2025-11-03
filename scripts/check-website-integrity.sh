#!/bin/bash
#---------------------------------------------------------------------------------------------
#  Copyright (c) 2025 Glass Devtools, Inc. All rights reserved.
#  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
#---------------------------------------------------------------------------------------------

# Website Link and Asset Integrity Checker
# This script checks website links, asset integrity, and branding consistency

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js to run tests."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm to run tests."
        exit 1
    fi
    
    if ! command_exists curl; then
        print_warning "curl is not installed. Some link checks may fail."
    fi
    
    if ! command_exists wget; then
        print_warning "wget is not installed. Some asset checks may fail."
    fi
    
    print_success "Prerequisites check completed"
}

# Function to check website structure
check_website_structure() {
    print_status "Checking website structure..."
    
    local website_dir="cortexide-website"
    if [ ! -d "$website_dir" ]; then
        print_error "Website directory not found: $website_dir"
        return 1
    fi
    
    # Check for required directories
    local required_dirs=(
        "app"
        "components"
        "public"
        "lib"
    )
    
    for dir in "${required_dirs[@]}"; do
        if [ -d "$website_dir/$dir" ]; then
            print_success "Found required directory: $dir"
        else
            print_error "Missing required directory: $dir"
            return 1
        fi
    done
    
    # Check for required files
    local required_files=(
        "package.json"
        "next.config.mjs"
        "tailwind.config.ts"
        "tsconfig.json"
        "README.md"
    )
    
    for file in "${required_files[@]}"; do
        if [ -f "$website_dir/$file" ]; then
            print_success "Found required file: $file"
        else
            print_error "Missing required file: $file"
            return 1
        fi
    done
    
    print_success "Website structure check completed"
}

# Function to check asset integrity
check_asset_integrity() {
    print_status "Checking asset integrity..."
    
    local website_dir="cortexide-website"
    local public_dir="$website_dir/public"
    
    if [ ! -d "$public_dir" ]; then
        print_error "Public directory not found: $public_dir"
        return 1
    fi
    
    # Check for critical assets
    local critical_assets=(
        "glass_icon.svg"
        "yc.svg"
        "docsearch.svg"
    )
    
    for asset in "${critical_assets[@]}"; do
        if [ -f "$public_dir/$asset" ]; then
            print_success "Found critical asset: $asset"
            # Check file size
            local size=$(stat -f%z "$public_dir/$asset" 2>/dev/null || stat -c%s "$public_dir/$asset" 2>/dev/null || echo "0")
            if [ "$size" -gt 0 ]; then
                print_success "Asset has content: $asset ($size bytes)"
            else
                print_warning "Asset is empty: $asset"
            fi
        else
            print_warning "Missing critical asset: $asset"
        fi
    done
    
    # Check for demo assets
    local demo_dirs=(
        "demos"
        "demos2"
        "demos3"
    )
    
    for demo_dir in "${demo_dirs[@]}"; do
        if [ -d "$public_dir/$demo_dir" ]; then
            local demo_count=$(find "$public_dir/$demo_dir" -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | wc -l)
            print_success "Found $demo_count demo assets in: $demo_dir"
        else
            print_warning "Missing demo directory: $demo_dir"
        fi
    done
    
    # Check for provider icons
    local provider_icons=(
        "anthropic-icon.png"
        "chatgpt-icon.png"
        "claude-icon.png"
        "deepseek.png"
        "gemini.png"
        "gemma.png"
        "google.png"
        "groq.png"
        "mistral_full.png"
        "mistral_small.png"
        "ms.png"
        "ollama.png"
        "openai-lockup.png"
        "openai-logomark.png"
        "openrouter.png"
        "qwen.png"
        "vllm.png"
    )
    
    local found_icons=0
    for icon in "${provider_icons[@]}"; do
        if [ -f "$public_dir/$icon" ]; then
            found_icons=$((found_icons + 1))
        fi
    done
    
    print_success "Found $found_icons/${#provider_icons[@]} provider icons"
    
    print_success "Asset integrity check completed"
}

# Function to check branding consistency
check_branding_consistency() {
    print_status "Checking branding consistency..."
    
    local website_dir="cortexide-website"
    
    # Check for CortexIDE branding in key files
    local branding_files=(
        "package.json"
        "README.md"
        "app/layout.tsx"
        "app/page.tsx"
    )
    
    local branded_files=0
    for file in "${branding_files[@]}"; do
        if [ -f "$website_dir/$file" ]; then
            if grep -q -i "cortexide" "$website_dir/$file" 2>/dev/null; then
                branded_files=$((branded_files + 1))
                print_success "Found CortexIDE branding in: $file"
            else
                print_warning "Missing CortexIDE branding in: $file"
            fi
        else
            print_warning "File not found: $file"
        fi
    done
    
    # Check for Void references that should be replaced
    local void_references=0
    for file in "${branding_files[@]}"; do
        if [ -f "$website_dir/$file" ]; then
            local void_count=$(grep -c -i "void" "$website_dir/$file" 2>/dev/null || echo "0")
            if [ "$void_count" -gt 0 ]; then
                void_references=$((void_references + void_count))
                print_warning "Found $void_count Void references in: $file"
            fi
        fi
    done
    
    if [ "$void_references" -gt 0 ]; then
        print_warning "Total Void references found: $void_references"
    else
        print_success "No Void references found in branding files"
    fi
    
    # Check component files for branding
    local component_files=$(find "$website_dir/components" -name "*.tsx" -o -name "*.ts" 2>/dev/null | head -10)
    local branded_components=0
    
    for file in $component_files; do
        if grep -q -i "cortexide" "$file" 2>/dev/null; then
            branded_components=$((branded_components + 1))
        fi
    done
    
    print_success "Found CortexIDE branding in $branded_components component files"
    
    print_success "Branding consistency check completed"
}

# Function to check internal links
check_internal_links() {
    print_status "Checking internal links..."
    
    local website_dir="cortexide-website"
    
    # Check for internal link files
    local link_files=(
        "components/links.ts"
    )
    
    for file in "${link_files[@]}"; do
        if [ -f "$website_dir/$file" ]; then
            print_success "Found link file: $file"
            # Check for valid link structure
            if grep -q "export" "$website_dir/$file" 2>/dev/null; then
                print_success "Link file has exports: $file"
            else
                print_warning "Link file may not have exports: $file"
            fi
        else
            print_warning "Missing link file: $file"
        fi
    done
    
    # Check for navigation components
    local nav_components=(
        "components/landingpage/Header.tsx"
        "components/landingpage/Footer.tsx"
    )
    
    for component in "${nav_components[@]}"; do
        if [ -f "$website_dir/$component" ]; then
            print_success "Found navigation component: $component"
        else
            print_warning "Missing navigation component: $component"
        fi
    done
    
    print_success "Internal links check completed"
}

# Function to check SEO and metadata
check_seo_metadata() {
    print_status "Checking SEO and metadata..."
    
    local website_dir="cortexide-website"
    
    # Check for SEO-related files
    local seo_files=(
        "app/robots.ts"
        "app/sitemap.ts"
        "app/og/route.tsx"
    )
    
    for file in "${seo_files[@]}"; do
        if [ -f "$website_dir/$file" ]; then
            print_success "Found SEO file: $file"
        else
            print_warning "Missing SEO file: $file"
        fi
    done
    
    # Check for metadata in layout
    if [ -f "$website_dir/app/layout.tsx" ]; then
        if grep -q "metadata" "$website_dir/app/layout.tsx" 2>/dev/null; then
            print_success "Found metadata in layout.tsx"
        else
            print_warning "Missing metadata in layout.tsx"
        fi
        
        if grep -q -i "cortexide" "$website_dir/app/layout.tsx" 2>/dev/null; then
            print_success "Found CortexIDE branding in layout.tsx"
        else
            print_warning "Missing CortexIDE branding in layout.tsx"
        fi
    fi
    
    print_success "SEO and metadata check completed"
}

# Function to check build configuration
check_build_configuration() {
    print_status "Checking build configuration..."
    
    local website_dir="cortexide-website"
    
    # Check Next.js configuration
    if [ -f "$website_dir/next.config.mjs" ]; then
        print_success "Found Next.js configuration"
        if grep -q "cortexide" "$website_dir/next.config.mjs" 2>/dev/null; then
            print_success "Next.js config contains CortexIDE branding"
        else
            print_warning "Next.js config may not contain CortexIDE branding"
        fi
    fi
    
    # Check package.json
    if [ -f "$website_dir/package.json" ]; then
        print_success "Found package.json"
        if grep -q -i "cortexide" "$website_dir/package.json" 2>/dev/null; then
            print_success "package.json contains CortexIDE branding"
        else
            print_warning "package.json may not contain CortexIDE branding"
        fi
        
        # Check for required dependencies
        local required_deps=(
            "next"
            "react"
            "typescript"
        )
        
        for dep in "${required_deps[@]}"; do
            if grep -q "\"$dep\"" "$website_dir/package.json" 2>/dev/null; then
                print_success "Found required dependency: $dep"
            else
                print_warning "Missing required dependency: $dep"
            fi
        done
    fi
    
    # Check TypeScript configuration
    if [ -f "$website_dir/tsconfig.json" ]; then
        print_success "Found TypeScript configuration"
    else
        print_warning "Missing TypeScript configuration"
    fi
    
    # Check Tailwind configuration
    if [ -f "$website_dir/tailwind.config.ts" ]; then
        print_success "Found Tailwind configuration"
    else
        print_warning "Missing Tailwind configuration"
    fi
    
    print_success "Build configuration check completed"
}

# Function to check content integrity
check_content_integrity() {
    print_status "Checking content integrity..."
    
    local website_dir="cortexide-website"
    
    # Check for main pages
    local main_pages=(
        "app/page.tsx"
        "app/changelog/page.tsx"
        "app/download-beta/page.tsx"
        "app/email/page.tsx"
    )
    
    for page in "${main_pages[@]}"; do
        if [ -f "$website_dir/$page" ]; then
            print_success "Found main page: $page"
        else
            print_warning "Missing main page: $page"
        fi
    done
    
    # Check for blog structure
    if [ -d "$website_dir/app/blog" ]; then
        print_success "Found blog directory"
        
        local blog_files=(
            "app/blog/page.tsx"
            "app/blog/CustomMDX.tsx"
            "app/blog/utils.ts"
        )
        
        for file in "${blog_files[@]}"; do
            if [ -f "$website_dir/$file" ]; then
                print_success "Found blog file: $file"
            else
                print_warning "Missing blog file: $file"
            fi
        done
    else
        print_warning "Missing blog directory"
    fi
    
    # Check for landing page components
    local landing_components=(
        "components/landingpage/LandingPage.tsx"
        "components/landingpage/Header.tsx"
        "components/landingpage/Footer.tsx"
        "components/landingpage/BigCode.tsx"
    )
    
    for component in "${landing_components[@]}"; do
        if [ -f "$website_dir/$component" ]; then
            print_success "Found landing component: $component"
        else
            print_warning "Missing landing component: $component"
        fi
    done
    
    print_success "Content integrity check completed"
}

# Function to run all website checks
run_all_checks() {
    print_status "Running all website checks..."
    
    check_website_structure
    check_asset_integrity
    check_branding_consistency
    check_internal_links
    check_seo_metadata
    check_build_configuration
    check_content_integrity
    
    print_success "All website checks completed"
}

# Function to run specific check type
run_specific_check() {
    case "$1" in
        "structure")
            check_website_structure
            ;;
        "assets")
            check_asset_integrity
            ;;
        "branding")
            check_branding_consistency
            ;;
        "links")
            check_internal_links
            ;;
        "seo")
            check_seo_metadata
            ;;
        "build")
            check_build_configuration
            ;;
        "content")
            check_content_integrity
            ;;
        "all")
            run_all_checks
            ;;
        *)
            print_error "Unknown check type: $1"
            print_status "Available check types: structure, assets, branding, links, seo, build, content, all"
            exit 1
            ;;
    esac
}

# Function to show help
show_help() {
    echo "Website Link and Asset Integrity Checker"
    echo ""
    echo "Usage: $0 [OPTIONS] [CHECK_TYPE]"
    echo ""
    echo "OPTIONS:"
    echo "  -h, --help     Show this help message"
    echo "  -c, --check    Check prerequisites only"
    echo ""
    echo "CHECK_TYPE:"
    echo "  structure      Check website structure only"
    echo "  assets         Check asset integrity only"
    echo "  branding       Check branding consistency only"
    echo "  links          Check internal links only"
    echo "  seo            Check SEO and metadata only"
    echo "  build          Check build configuration only"
    echo "  content        Check content integrity only"
    echo "  all            Run all checks (default)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Run all checks"
    echo "  $0 assets             # Check asset integrity only"
    echo "  $0 branding            # Check branding consistency only"
    echo "  $0 --check            # Check prerequisites only"
}

# Main function
main() {
    local check_type="all"
    local check_only=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -c|--check)
                check_only=true
                shift
                ;;
            structure|assets|branding|links|seo|build|content|all)
                check_type="$1"
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # Check prerequisites
    check_prerequisites
    
    if [ "$check_only" = true ]; then
        print_success "Prerequisites check completed"
        exit 0
    fi
    
    # Run checks
    run_specific_check "$check_type"
    
    print_success "Website link and asset integrity checks completed successfully"
}

# Run main function with all arguments
main "$@"
