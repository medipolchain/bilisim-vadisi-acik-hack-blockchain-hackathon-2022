#include <OneWire.h> // OneWire kütüphane dosyası çağrıldı
#include <DallasTemperature.h> // DallasTemperature kütüphane dosyası çağrıldı

OneWire oneWire(2);
DallasTemperature DS18B20(&oneWire);

DeviceAddress DS18B20adres;

float santigrat, fahrenheit;

void setup(void){

 Serial.begin(9600);
 DS18B20.begin();
 DS18B20.getAddress(DS18B20adres, 0);
 DS18B20.setResolution(DS18B20adres, 12);
}

void loop(void){

 DS18B20.requestTemperatures();
 santigrat = DS18B20.getTempC(DS18B20adres);

 Serial.print(santigrat);

 Serial.print(" C -- ");
}
