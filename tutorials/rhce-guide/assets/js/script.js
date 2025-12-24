document.addEventListener("DOMContentLoaded", function() {
    // 1. 定義所有課程的檔案名稱 (順序很重要！)
    const pages = [
        "day_01_terminal_intro.html",
        "day_02_file_management.html",
        "day_03_vim_io.html",
        "day_04_users_groups.html",
        "day_05_permissions.html",
        "day_06_processes_logs.html",
        "day_07_systemd_services.html",
        "day_08_ssh_archives.html",
        "day_09_network_config.html",
        "day_10_software_management.html",
        "day_11_regex_grep.html",
        "day_12_scheduling.html",
        "day_13_tuning_nice.html",
        "day_14_acl_access.html",
        "day_15_selinux_security.html",
        "day_16_partitions_fs.html",
        "day_17_lvm_storage.html",
        "day_18_stratis_vdo.html",
        "day_19_boot_rescue.html",
        "day_20_podman_containers.html",
        "day_21_ansible_intro.html",
        "day_22_playbook_yaml.html",
        "day_23_vars_facts.html",
        "day_24_loops_handlers.html",
        "day_25_templates_files.html",
        "day_26_roles_galaxy.html",
        "day_27_troubleshooting.html",
        "day_28_storage_network_auto.html",
        "day_29_users_security_auto.html",
        "day_30_mock_exam.html"
    ];

    // 2. 找出目前頁面是第幾天
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    const currentIndex = pages.indexOf(currentPage);

    // 3. 計算上一頁與下一頁
    // 預設連結回目錄 (使用標準 index.html)
    let prevLink = "day_00_index.html"; 
    let nextLink = "day_00_index.html"; 
    let prevText = "回目錄";
    let nextText = "回目錄";
    
    // --- 核心修改：根據天數決定顏色主題 ---
    let footerBgClass = "bg-slate-50";       // 預設
    let footerBorderClass = "border-slate-200"; 
    let linkHoverClass = "hover:text-slate-600"; 
    let btnClass = "bg-slate-200 hover:bg-slate-300 text-slate-700"; 

    if (currentIndex >= 0 && currentIndex < 10) {
        // Phase 1 (Day 1-10): 紅色主題
        footerBgClass = "bg-red-50";
        footerBorderClass = "border-red-200";
        linkHoverClass = "hover:text-red-700";
        btnClass = "bg-red-100 hover:bg-red-200 text-red-800";
    } else if (currentIndex >= 10 && currentIndex < 20) {
        // Phase 2 (Day 11-20): 黃色/琥珀色主題
        footerBgClass = "bg-amber-50"; 
        footerBorderClass = "border-amber-200";
        linkHoverClass = "hover:text-amber-700";
        btnClass = "bg-amber-100 hover:bg-amber-200 text-amber-800";
    } else if (currentIndex >= 20 && currentIndex < 30) {
        // Phase 3 (Day 21-30): 藍色主題
        footerBgClass = "bg-sky-50"; 
        footerBorderClass = "border-sky-200";
        linkHoverClass = "hover:text-sky-700";
        btnClass = "bg-sky-100 hover:bg-sky-200 text-sky-800";
    }

    // 4. 計算上一頁與下一頁邏輯
    if (currentIndex > 0) {
        prevLink = pages[currentIndex - 1];
        prevText = `上一課 (Day ${currentIndex})`;
    }

    if (currentIndex < pages.length - 1 && currentIndex !== -1) {
        nextLink = pages[currentIndex + 1];
        nextText = `下一課 (Day ${currentIndex + 2})`;
    } else if (currentIndex === pages.length - 1) {
        nextText = "恭喜完賽！回首頁";
    }

    // 5. 生成 HTML (套用動態顏色 class)
    const navHtml = `
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 px-4 max-w-4xl mx-auto">
            <a href="${prevLink}" class="flex items-center text-slate-600 transition font-bold ${linkHoverClass}">
                <i class="fas fa-arrow-left mr-2"></i> ${prevText}
            </a>
            
            <a href="day_00_index.html" class="px-6 py-2 rounded-full font-bold transition ${btnClass}">
                <i class="fas fa-th-large mr-2"></i> 回目錄
            </a>

            <a href="${nextLink}" class="flex items-center text-slate-600 transition font-bold ${linkHoverClass}">
                ${nextText} <i class="fas fa-arrow-right ml-2"></i>
            </a>
        </div>
        <p class="text-center text-slate-400 text-sm mt-6">RHCSA/RHCE 30-Day Challenge - Day ${currentIndex + 1} Completed</p>
    `;

    // 6. 插入頁面
    // 先找找看有沒有已經存在的 footer (如果有寫死的話)
    let footer = document.querySelector("footer");
    
    if (!footer) {
        // 如果沒有，則建立新的
        const mainElement = document.querySelector("main");
        footer = document.createElement("footer");
        if (mainElement) {
            mainElement.appendChild(footer);
        } else {
            document.body.appendChild(footer);
        }
    }

    // 設定 class 和內容
    footer.className = `mt-12 py-8 ${footerBgClass} ${footerBorderClass} border-t`;
    footer.innerHTML = navHtml;
});