HEUFT Smart Regal System — Test Paketi
========================================

KURULUM:
1. ZIP'i bir klasöre ÇIKARTIN (Çıkart / Extract All), zip içinden çift tıklamayın —
   bazı tarayıcılar zip içinden açılan dosyalarda script'leri engelliyor ve hiçbir
   buton çalışmaz (önceki paketteki "Almanca'ya geçmiyor" sorunu buydu).
2. Çıkardığınız klasördeki index.html dosyasını açın (Chrome/Edge önerilir).
   Artık tüm kod (CSS+JS) tek dosyada — sadece Chart.js ve ikon fontu CDN'den
   yükleniyor, bunun için internet bağlantısı gerekir. İnternet yoksa grafik ve
   ikonlar görünmez ama TÜM menüler, dil değiştirme, artikel/RFID ekleme yine çalışır.

ÖZELLİKLER:
- Sağ üstte TR / DE dil değiştirici — tüm menüler iki dilde çalışır.
- Sol üstteki H logosuna tıklayıp kendi firma logonuzu yükleyebilirsiniz.
- ARTİKEL / ÜRÜN sayfasında "Yeni Artikel Ekle":
  * HBE numarası, ürün adı, üretici, konum
  * Birim ürün ağırlığı + kutu aktif ağırlığı girilince adet otomatik hesaplanır
  * Ürün resmi ve QR kod yükleme (drag yok, tıkla-seç)
- RFID YÖNETİM sayfasında:
  * "Tag Ekle" ile yeni RFID tanımlanır (bağlı artikel seçilir)
  * Listedeki her satırda kalem (düzenle) ve çöp kutusu (sil) ikonları çalışır
  * Satıra tıklayınca o RFID'nin hangi ürüne ve hangi regal konumuna bağlı olduğu detay penceresinde gösterilir
- MQTT Monitor sayfası 1.8 sn'de bir simüle mesaj üretir (gerçek broker yok, demo veri).
- Diğer tüm menüler (Dashboard, Regal Yapısı, LoadCell, ESP32, İnventur, İstatistikler, Uyarılar, Ayarlar) gezilebilir durumda.

BU SÜRÜMDE DÜZELTİLEN:
- TR/DE dil değiştirme artık tek dosyada, dış script dosyalarına bağımlı değil
  (önceki paket app.js + i18n.js'i ayrı dosya olarak yüklüyordu; zip'ten çıkarmadan
  açılırsa bu dosyalar yüklenemiyor ve hiçbir buton/dil çalışmıyordu).
- Otomatik tarayıcı testiyle doğrulandı: TR↔DE geçişi, Artikel ekleme (ağırlık→adet
  hesabı dahil), RFID ekle/düzenle/sil/detay akışlarının hepsi çalışıyor.

BİLİNEN EKSİKLER (sıradaki adımda tamamlanacak):
- Artikel ekle/sil/düzenle kalıcı değil (sayfa yenilenince sıfırlanır — henüz backend/DB yok)
- Gerçek MQTT broker bağlantısı yok, veriler simüle
- Regal yapısı sayfasında kat/box ekleme henüz pasif (placeholder)
- RFID silme native tarayıcı onay penceresi (confirm) kullanıyor — bu normal, "Tamam"a basmanız yeterli

Test ettikten sonra hangi eksikleri önce tamamlamamı istediğinizi söyleyin.
